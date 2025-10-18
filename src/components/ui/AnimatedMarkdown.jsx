import { useState, useEffect } from 'react';
import { Markdown } from './Markdown';

export function AnimatedMarkdown({
  children,
  className = '',
  shouldAnimate = false,
  messageId,
  maxDurationMs = 10000,
  onUpdate,
}) {
  const [visibleText, setVisibleText] = useState(shouldAnimate ? '' : children);

  useEffect(() => {
    if (!shouldAnimate || !children?.trim()) {
      setVisibleText(children);
      return;
    }

    const safeDuration = Math.max(1000, maxDurationMs);

    setVisibleText('');

    const TYPING_INTERVAL = 20;
    const totalChars = children.length;
    const totalSteps = Math.ceil(safeDuration / TYPING_INTERVAL);
    const charsPerStep = Math.max(1, Math.ceil(totalChars / totalSteps));

    let visibleCharCount = 0;
    const interval = setInterval(() => {
      visibleCharCount += charsPerStep;
      if (visibleCharCount >= totalChars) {
        setVisibleText(children);
        clearInterval(interval);
        onUpdate?.();
      } else {
        setVisibleText(children.slice(0, visibleCharCount));
        onUpdate?.();
      }
    }, TYPING_INTERVAL);

    return () => clearInterval(interval);
  }, [children, shouldAnimate, messageId, maxDurationMs, onUpdate]);

  return (
    <Markdown className={className}>
      {visibleText}
    </Markdown>
  );
}
