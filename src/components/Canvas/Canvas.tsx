import React, { HTMLProps, ReactElement } from 'react';
import { useCanvas, OnRenderCallback } from './useCanvas';

import styles from './Canvas.scss';

export type CanvasProps = HTMLProps<HTMLCanvasElement> & {
  onRender: OnRenderCallback;
};

export const Canvas = ({ onRender, ...props }: CanvasProps): ReactElement => {
  const canvasRef = useCanvas(onRender);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} {...props} />
    </div>
  );
};
