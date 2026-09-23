import React, { useEffect, useRef, useState } from 'react';

// Two panes with a draggable divider. `direction="horizontal"` puts them side by side,
// `"vertical"` stacks them. The first pane's size is a percentage, remembered in
// localStorage under `storageKey`. When `showSecond` is false the first pane fills the space.
const SplitPane = ({
  direction = 'horizontal',
  initialSize = 50,
  minSize = 15,
  maxSize = 85,
  storageKey,
  showSecond = true,
  children,
}) => {
  const [first, second] = React.Children.toArray(children);
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState(() => {
    const saved = storageKey ? parseFloat(localStorage.getItem(storageKey)) : NaN;
    return Number.isFinite(saved) ? Math.min(maxSize, Math.max(minSize, saved)) : initialSize;
  });

  const horizontal = direction === 'horizontal';

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, String(size));
  }, [size, storageKey]);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (event) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = horizontal
        ? ((event.clientX - rect.left) / rect.width) * 100
        : ((event.clientY - rect.top) / rect.height) * 100;
      setSize(Math.min(maxSize, Math.max(minSize, pct)));
    };
    const stop = () => setDragging(false);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging, horizontal, minSize, maxSize]);

  const handleKeyDown = (event) => {
    const step = event.shiftKey ? 10 : 2;
    const decrease = horizontal ? 'ArrowLeft' : 'ArrowUp';
    const increase = horizontal ? 'ArrowRight' : 'ArrowDown';
    if (event.key === decrease) setSize((s) => Math.max(minSize, s - step));
    else if (event.key === increase) setSize((s) => Math.min(maxSize, s + step));
    else return;
    event.preventDefault();
  };

  return (
    <div ref={containerRef} className={`flex ${horizontal ? 'flex-row' : 'flex-col'} w-full h-full min-w-0 min-h-0`}>
      <div
        className="relative min-w-0 min-h-0 flex flex-col"
        style={showSecond ? { flex: `0 0 ${size}%` } : { flex: '1 1 auto' }}
      >
        {first}
      </div>

      {showSecond && (
        <>
          <div
            role="separator"
            aria-orientation={horizontal ? 'vertical' : 'horizontal'}
            aria-valuenow={Math.round(size)}
            aria-valuemin={minSize}
            aria-valuemax={maxSize}
            tabIndex={0}
            onPointerDown={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDoubleClick={() => setSize(initialSize)}
            onKeyDown={handleKeyDown}
            title="Drag to resize (double-click to reset)"
            className={`shrink-0 bg-slate-700 hover:bg-blue-500 focus:bg-blue-500 focus:outline-none transition-colors ${
              dragging ? 'bg-blue-500' : ''
            } ${horizontal ? 'w-1.5 cursor-col-resize' : 'h-1.5 cursor-row-resize'}`}
          />
          <div className="relative flex-1 min-w-0 min-h-0 flex flex-col">{second}</div>
        </>
      )}

      {/* Covers iframes while dragging so they don't swallow pointer events. */}
      {dragging && (
        <div className={`fixed inset-0 z-[100] ${horizontal ? 'cursor-col-resize' : 'cursor-row-resize'}`} />
      )}
    </div>
  );
};

export default SplitPane;
