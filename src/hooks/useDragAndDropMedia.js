import { useState, useCallback } from 'react';

export const useDragAndDropMedia = (onDropFiles) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDraggingOver(false);

      const files = Array.from(event.dataTransfer?.files || []);
      if (files.length && onDropFiles) {
        await onDropFiles(files);
      }
    },
    [onDropFiles]
  );

  return {
    isDraggingOver,
    handlers: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
};
