import { useEffect, useRef, useState } from 'react'
import { useUiStore } from '@/store/uiStore'
import { usePuzzleStore } from '@/store/puzzleStore'
import { loadImage } from '@/api/pixabay'
import { useElementSize } from '@/hooks/useElementSize'
import { PuzzleBoard } from './PuzzleBoard'
import { Controls } from './Controls'
import { Timer } from './Timer'
import { CompletionModal } from './CompletionModal'
import { HintToast } from './HintToast'
import { ZoomControls } from './ZoomControls'
import { Spinner } from './Spinner'

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

/** Orchestrates a single play session: load image → build puzzle → render board. */
export function Game() {
  const selectedImage = useUiStore((s) => s.selectedImage)
  const difficulty = useUiStore((s) => s.difficulty)
  const goHome = useUiStore((s) => s.goHome)

  const [wrapRef, size] = useElementSize<HTMLDivElement>()
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [state, setState] = useState<LoadState>('idle')
  const [reloadKey, setReloadKey] = useState(0)
  const setupKey = useRef<string>('')

  // Subscribe to the store so the board appears once the puzzle is built for
  // the current image. (Mutating a ref does not re-render - this does.)
  const puzzleReady = usePuzzleStore(
    (s) => s.shapes !== null && s.image?.id === selectedImage?.id,
  )

  // Load the source image whenever the selection changes.
  useEffect(() => {
    if (!selectedImage) return
    let cancelled = false
    setState('loading')
    setImg(null)
    setupKey.current = ''
    loadImage(selectedImage.url)
      .then((el) => {
        if (cancelled) return
        setImg(el)
        setState('ready')
      })
      .catch(() => !cancelled && setState('error'))
    return () => {
      cancelled = true
    }
  }, [selectedImage, reloadKey])

  // Build the puzzle once the image is loaded and we know the surface size.
  useEffect(() => {
    if (!selectedImage || !img || size.width < 320 || size.height < 320) return
    const key = `${selectedImage.id}|${difficulty}`
    if (setupKey.current === key) return
    setupKey.current = key
    usePuzzleStore.getState().setup({
      image: selectedImage,
      difficulty,
      surfaceW: size.width,
      surfaceH: size.height,
    })
  }, [selectedImage, difficulty, img, size.width, size.height])

  if (!selectedImage) {
    return (
      <div className="game-empty">
        <p>No image selected.</p>
        <button className="btn btn--primary" onClick={goHome}>
          Choose an image
        </button>
      </div>
    )
  }

  const ready = state === 'ready' && puzzleReady

  return (
    <div className="game">
      <Controls />
      <div className="game-body">
        <div className="game-stage" ref={wrapRef}>
        {state === 'loading' && (
          <div className="game-overlay">
            <Spinner />
            <p>Loading image…</p>
          </div>
        )}
        {state === 'error' && (
          <div className="game-overlay">
            <p>Couldn’t load that image.</p>
            <div className="game-overlay-actions">
              <button className="btn btn--primary" onClick={() => setReloadKey((k) => k + 1)}>
                Try again
              </button>
              <button className="btn" onClick={goHome}>
                Pick another
              </button>
            </div>
          </div>
        )}
        {/* Image is decoded but the board geometry is still being built. */}
        {state === 'ready' && img && !puzzleReady && (
          <div className="game-overlay">
            <Spinner />
            <p>Cutting your puzzle…</p>
          </div>
        )}
          {ready && img && (
            <>
              <PuzzleBoard img={img} />
              <HintToast />
            </>
          )}
        </div>
        {ready && <ZoomControls />}
      </div>
      <Timer />
      <CompletionModal />
    </div>
  )
}
