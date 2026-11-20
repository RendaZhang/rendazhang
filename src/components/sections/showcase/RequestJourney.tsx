import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SHOWCASE_STEPS } from '../../../content/showcaseContent';
import ShowcasePlayer, { type ShowcasePlayerProps } from './ShowcasePlayer';

interface RequestJourneyProps {
  showStep: ShowcasePlayerProps['onStep'];
  onReady: () => void;
}

function RequestJourney({ showStep, onReady }: RequestJourneyProps) {
  const [step, setStep] = useState(1);
  const advance = useCallback(
    (next: number, immediate?: boolean) => {
      showStep(next, immediate);
      setStep(next);
    },
    [showStep]
  );

  useEffect(() => {
    onReady();
  }, [onReady]);

  return <ShowcasePlayer step={step} total={SHOWCASE_STEPS.length} onStep={advance} />;
}

export function mountRequestJourney(
  container: HTMLElement,
  showStep: RequestJourneyProps['showStep'],
  onReady: () => void
): () => void {
  const root = createRoot(container);
  let run = 0;

  function restart() {
    run += 1;
    root.render(<RequestJourney key={run} showStep={showStep} onReady={onReady} />);
  }

  restart();
  return restart;
}
