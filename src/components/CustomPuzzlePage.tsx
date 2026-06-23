// Create a Custom Jigsaw Puzzle - upload any photo and play it as a jigsaw.
// The image is turned into a PuzzleImage locally (object URL, never uploaded)
// and handed to the existing preview → difficulty → play flow.
import { useEffect, useRef, useState } from 'react'
import { ALL_CATEGORIES, categorySlug } from '@/data/categories'
import { landingByKey } from '@/data/landings'
import { useUiStore } from '@/store/uiStore'
import type { PuzzleImage } from '@/types'
import { Icon } from '@/components/Icon'
import { applyLandingHead } from './landingSeo'
import './GalleryHome.css'
import './CustomPuzzlePage.css'

const KEY = 'create-a-custom-jigsaw-puzzle'

export function CustomPuzzlePage() {
  const landing = landingByKey(KEY)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!landing) return
    return applyLandingHead(landing)
  }, [landing])

  if (!landing) return null

  const cats = landing.categoryKeys
    .map((k) => ALL_CATEGORIES.find((c) => c.key === k))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  function handleFile(file: File | undefined | null) {
    setError(null)
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, GIF or WebP).')
      return
    }
    setBusy(true)
    const url = URL.createObjectURL(file)
    const probe = new Image()
    probe.onload = () => {
      setBusy(false)
      const image: PuzzleImage = {
        id: `custom-${Date.now()}`,
        url,
        thumbUrl: url,
        width: probe.naturalWidth,
        height: probe.naturalHeight,
        credit: 'Your photo',
      }
      // Reuse the standard start-a-puzzle flow (difficulty picker → play).
      useUiStore.getState().openPreview(image)
    }
    probe.onerror = () => {
      setBusy(false)
      URL.revokeObjectURL(url)
      setError("That image couldn't be loaded. Try a different photo.")
    }
    probe.src = url
  }

  return (
    <div className="gallery">
      <h1 className="sr-only">{landing.h1}</h1>

      <section className="ghome-about" aria-labelledby="custom-title">
        <div className="ghome-head">
          <div className="ghome-head-text">
            <span className="ghome-eyebrow">
              <Icon name="sparkle" size={13} /> Custom puzzle maker
            </span>
            <h2 className="section-title" id="custom-title">
              {landing.h1}
            </h2>
          </div>
        </div>
        <p className="ghome-about-lead">{landing.lead}</p>

        <div
          className="custom-drop"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFile(e.dataTransfer.files?.[0])
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="custom-drop-input"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Icon name="puzzle" size={32} />
          <p className="custom-drop-title">Drag a photo here</p>
          <p className="custom-drop-sub">or</p>
          <button
            type="button"
            className="btn btn--primary btn--lg"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <Icon name="search" size={18} />
            {busy ? 'Loading…' : 'Choose a photo'}
          </button>
          <p className="custom-drop-note">
            Your photo stays on your device - it is never uploaded.
          </p>
          {error ? (
            <p className="custom-drop-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        {landing.paras.map((p, i) => (
          <p className="ghome-about-lead" key={i}>
            {p}
          </p>
        ))}

        <h2 className="section-title">No photo handy? Play a ready-made puzzle</h2>
        <ul className="ghome-toplinks">
          {cats.map((c) => (
            <li key={c.key}>
              <a
                href={`/${categorySlug(c.label)}`}
                onClick={(e) => {
                  e.preventDefault()
                  useUiStore.getState().browseCategory(c)
                }}
              >
                {c.label} puzzles
              </a>
            </li>
          ))}
          <li>
            <a
              href="/categories"
              onClick={(e) => {
                e.preventDefault()
                useUiStore.getState().showCategories()
              }}
            >
              All categories
            </a>
          </li>
        </ul>

        <h2 className="section-title ghome-faq-title">Frequently asked questions</h2>
        <dl className="ghome-faq">
          {landing.faq.map(([q, a]) => (
            <div className="ghome-faq-item" key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
