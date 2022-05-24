import { RefObject, useEffect, useRef } from 'react';

export type OnRenderCallback = (
  context: CanvasRenderingContext2D,
  when: DOMHighResTimeStamp,
) => void;

function useOnResize(ref: RefObject<HTMLCanvasElement>): void {
  useEffect(() => {
    const canvas = ref.current;
    if (canvas === null) {
      return;
    }

    const parent = canvas.parentElement;
    if (parent === null) {
      return;
    }

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();

      canvas.width = Math.floor(width);
      canvas.height = Math.floor(height);
    };

    window.addEventListener('resize', resize);

    resize();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);
}

function useOnRender(
  ref: RefObject<HTMLCanvasElement>,
  onRender: OnRenderCallback,
): void {
  useEffect(() => {
    const canvas = ref.current;
    if (canvas === null) {
      return;
    }

    const context = canvas.getContext('2d');
    if (context === null) {
      return;
    }

    let requestId: number;

    const render = (when: DOMHighResTimeStamp) => {
      onRender(context, when);

      requestId = window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(requestId);
    };
  }, [onRender]);
}

export function useCanvas(
  onRender: OnRenderCallback,
): RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useOnResize(canvasRef);
  useOnRender(canvasRef, onRender);

  return canvasRef;
}
