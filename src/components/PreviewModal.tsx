// PreviewModal - the "start a puzzle" step (gallery card → here → play).
// Simple & clean: framed image, photographer credit, difficulty picker, Play.
import { useUiStore } from '@/store/uiStore'
import type { GalleryPuzzle } from '@/data/gallery'
import { Icon } from '@/components/Icon'
import { Modal } from './Modal'
import { DifficultyPicker } from './DifficultyPicker'
import './PreviewModal.css'

export function PreviewModal() {
  const showPreview = useUiStore((s) => s.showPreview)
  const previewImage = useUiStore((s) => s.previewImage)

  const close = (): void => useUiStore.getState().closePreview()

  const play = (): void => {
    const { previewImage: img, difficulty, startPuzzle } = useUiStore.getState()
    if (img) startPuzzle(img, difficulty)
  }

  if (!previewImage) return null

  const g = previewImage as Partial<GalleryPuzzle>
  const author =
    g.author ??
    previewImage.credit?.replace(/^(Photo|Image)\s+by\s+/i, '').replace(/\s+on Pixabay$/i, '') ??
    null

  return (
    <Modal open={showPreview} onClose={close} maxWidth={560}>
      <div className="preview">
        <div className="preview-top">
          <figure className="preview-figure">
            <img
              className="preview-img"
              src={previewImage.url}
              alt={author ? `Photo by ${author}` : 'Puzzle image'}
              width={previewImage.width}
              height={previewImage.height}
            />
          </figure>
          <div className="preview-head">
            <p className="preview-eyebrow">Start a puzzle</p>
            {author ? <h2 className="preview-author">by {author}</h2> : null}
          </div>
        </div>

        <div className="preview-picker">
          <DifficultyPicker />
        </div>

        <button type="button" className="btn btn--primary btn--lg preview-play" onClick={play}>
          <Icon name="play" size={18} />
          Play
        </button>
      </div>
    </Modal>
  )
}
