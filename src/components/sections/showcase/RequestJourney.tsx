import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SHOWCASE_STEPS } from '../../../content/showcaseContent';
import ShowcasePlayer from './ShowcasePlayer';

interface RequestJourneyProps {
  showStep: (step: number) => void;
  onReady: () => void;
}

function RequestJourney({ showStep, onReady }: RequestJourneyProps) {
  const [step, setStep] = useState(1);
  const advance = useCallback(
    (next: number) => {
      showStep(next);
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
  showStep: (step: number) => void,
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
