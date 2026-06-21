import type { ReactNode } from 'react';
import { Modal } from './Modal';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/components/Icon';
import { useUiStore } from '@/store/uiStore';
import './HowToModal.css';

interface Step {
  icon: IconName;
  body: ReactNode;
}

const STEPS: Step[] = [
  {
    icon: 'image',
    body: (
      <>
        <strong>Browse the gallery</strong> and pick a puzzle that catches your
        eye.
      </>
    ),
  },
  {
    icon: 'settings',
    body: (
      <>
        Choose a <strong>difficulty</strong> and press <strong>Play</strong>.
      </>
    ),
  },
  {
    icon: 'play',
    body: (
      <>
        <strong>Drag pieces</strong> around the board with your mouse or by
        touch.
      </>
    ),
  },
  {
    icon: 'puzzle',
    body: (
      <>
        Correct neighbours <strong>snap together</strong> and then move as a
        single group.
      </>
    ),
  },
  {
    icon: 'check',
    body: (
      <>
        Drop a piece near its <strong>true spot</strong> to lock it onto the
        board.
      </>
    ),
  },
  {
    icon: 'eye',
    body: (
      <>
        Use <span className="howto-kbd">Preview</span>,{' '}
        <span className="howto-kbd">Shuffle</span> and{' '}
        <span className="howto-kbd">Solve</span> anytime.
      </>
    ),
  },
  {
    icon: 'trophy',
    body: (
      <>
        Complete the picture to <strong>win</strong> - no account needed, ever.
      </>
    ),
  },
];

export function HowToModal() {
  const open = useUiStore((s) => s.showHowTo);

  return (
    <Modal
      open={open}
      onClose={() => useUiStore.getState().closeHowTo()}
      title="How to play"
      maxWidth={560}
    >
      <p className="howto-intro">
        Jigsaw Studio is a relaxed, pick-up-and-play puzzle. Seven calm steps
        from blank board to finished picture:
      </p>

      <ol className="howto-list">
        {STEPS.map((step, i) => (
          <li className="howto-step" key={i}>
            <span className="howto-step__num" aria-hidden="true" />
            <span className="howto-step__icon" aria-hidden="true">
              <Icon name={step.icon} size={18} />
            </span>
            <p className="howto-step__body">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="howto-footnote">Have fun, and take your time.</p>
    </Modal>
  );
}
