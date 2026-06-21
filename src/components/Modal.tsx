import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/Icon';
import './Modal.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal(props: ModalProps): React.ReactPortal | null {
  const { open, onClose, title, children, maxWidth = 480 } = props;

  const cardRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Keep a stable reference to onClose so the effect doesn't re-run each render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Close only when the press starts on the backdrop itself, never when it
    // bubbles up from inside the dialog card (prevents drag-out false closes).
    if (e.target === e.currentTarget) onCloseRef.current();
  }, []);

  // While open: lock body scroll, capture & restore focus, trap Tab, wire Esc.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const card = cardRef.current;
    // Move focus into the dialog once mounted.
    const first = card?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? card)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && card) {
        const nodes = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null || el === document.activeElement,
        );
        if (nodes.length === 0) {
          // Nothing focusable - keep focus pinned to the dialog.
          e.preventDefault();
          card.focus();
          return;
        }
        const firstEl = nodes[0];
        const lastEl = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === firstEl || active === card)) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && active === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onMouseDown={handleBackdropClick}>
      <div
        ref={cardRef}
        className="card modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={title ? undefined : 'Dialog'}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        style={{ maxWidth }}
      >
        {title ? (
          <header className="modal-header">
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
            <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
              <Icon name="close" size={18} />
            </button>
          </header>
        ) : (
          <button
            type="button"
            className="modal-close modal-close--floating"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="close" size={18} />
          </button>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
