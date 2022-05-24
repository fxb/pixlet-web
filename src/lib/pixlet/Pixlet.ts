import './wasm_exec.js';

type RenderResultInternal = {
  frames: Array<Promise<ImageBitmap>>;
  delay: number;
};

export type RenderResult = {
  frames: Array<ImageBitmap>;
  delay: number;
};

declare global {
  interface Window {
    pixlet: {
      render: (code: string) => Promise<RenderResultInternal>;
    };
  }
}

// https://github.com/golang/go/wiki/WebAssembly
export class Pixlet {
  private readonly _ready: Promise<void>;

  constructor() {
    const go = new Go();

    this._ready = WebAssembly.instantiateStreaming(
      window.fetch('pixlet.wasm'),
      go.importObject,
    ).then(({ instance }) => {
      go.run(instance);
    });
  }

  async render(code: string): Promise<RenderResult> {
    await this._ready;

    const { frames, delay } = await window.pixlet.render(code);

    return {
      frames: await Promise.all(frames),
      delay,
    };
  }
}
