import { useState, useCallback, useEffect, useRef } from 'react';

interface UseResizeOptions {
  direction: 'horizontal' | 'vertical';
  initialSize: number;
  minSize: number;
  maxSize: number;
  reverse?: boolean; // for bottom panel (drag up = bigger)
}

export function useResize({ direction, initialSize, minSize, maxSize, reverse = false }: UseResizeOptions) {
  const [size, setSize] = useState(initialSize);
  const isResizing = useRef(false);
  const startPos = useRef(0);
  const startSize = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      startPos.current = direction === 'horizontal' ? e.clientX : e.clientY;
      startSize.current = size;
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    },
    [direction, size]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
      const diff = currentPos - startPos.current;
      const newSize = reverse
        ? startSize.current - diff
        : startSize.current + diff;
      setSize(Math.min(maxSize, Math.max(minSize, newSize)));
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [direction, minSize, maxSize, reverse]);

  return { size, setSize, handleMouseDown };
}


