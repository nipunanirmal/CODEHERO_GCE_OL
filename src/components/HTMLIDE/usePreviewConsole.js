import { useCallback, useRef, useState } from 'react';

const MAX_ENTRIES = 500;

// Collects console output from the sandboxed preview. The panel opens by itself when
// output arrives; if the user closes it, only errors re-open it.
export function usePreviewConsole() {
  const [entries, setEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const dismissedRef = useRef(false);
  const nextIdRef = useRef(0);

  const handleConsoleMessage = useCallback(({ kind, text }) => {
    if (kind === 'reset' || kind === 'clear') {
      setEntries([]);
      return;
    }
    nextIdRef.current += 1;
    const entry = { id: nextIdRef.current, kind, text };
    setEntries((prev) => [...prev.slice(-(MAX_ENTRIES - 1)), entry]);
    if (!dismissedRef.current || kind === 'error') setOpen(true);
  }, []);

  const closeConsole = useCallback(() => {
    dismissedRef.current = true;
    setOpen(false);
  }, []);

  const toggleConsole = useCallback(() => {
    setOpen((wasOpen) => {
      dismissedRef.current = wasOpen;
      return !wasOpen;
    });
  }, []);

  const clearConsole = useCallback(() => setEntries([]), []);

  const errorCount = entries.filter((e) => e.kind === 'error').length;
  const warnCount = entries.filter((e) => e.kind === 'warn').length;

  return {
    entries,
    open,
    errorCount,
    warnCount,
    handleConsoleMessage,
    closeConsole,
    toggleConsole,
    clearConsole,
  };
}
