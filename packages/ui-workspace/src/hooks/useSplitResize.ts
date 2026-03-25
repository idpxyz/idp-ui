import { useState, useCallback, useEffect, useRef } from 'react';

export function useSplitResize(direction: 'horizontal' | 'vertical') {
  const [ratio, setRatio] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    },
    [direction]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = direction === 'horizontal'
        ? e.clientX - rect.left
        : e.clientY - rect.top;
      const total = direction === 'horizontal' ? rect.width : rect.height;
      const newRatio = Math.min(80, Math.max(20, (pos / total) * 100));
      setRatio(newRatio);
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
  }, [direction]);

  return { ratio, setRatio, containerRef, handleMouseDown };
}
