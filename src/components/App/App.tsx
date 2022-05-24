import Editor from '@monaco-editor/react';
import React, { ReactElement } from 'react';

import { Pixlet, RenderResult } from '../../lib/pixlet/Pixlet';
import { Canvas } from '../Canvas/Canvas';

import styles from './App.scss';

const instance = new Pixlet();

const defaultCode = `load("render.star", "render")
load("animation.star", "animation")
load("math.star", "math")
load("encoding/base64.star", "base64")

def linear(x):
    return x

def easeInElastic(x):
    c4 = (2.0 * math.pi) / 3.0

    if x == 0:
        return 0
    elif x == 1:
        return 1

    return -math.pow(2, 10 * x - 10) * math.sin((x * 10 - 10.75) * c4)

def easeOutBounce(x):
    n1 = 7.5625
    d1 = 2.75

    if x < 1 / d1:
        return n1 * x * x
    elif x < 2 / d1:
        x = x - (1.5 / d1)
        return n1 * (x) * x + 0.75
    elif x < 2.5 / d1:
        x = x - (2.25 / d1)
        return n1 * (x) * x + 0.9375
    else:
        x = x - (2.625 / d1)
        return n1 * (x) * x + 0.984375

EARTH = render.Image(
    base64.decode("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"),
    width = 8,
    height = 8,
)

def main():
    #return render.Root(
    #    render.Marquee(
    #        render.Text("This won't fit in 64 pixels"),
    #        width = 64,
    #    ),
    #)

    return render.Root(
        child = animation.Transformation(
            child = render.Box(render.Circle(diameter = 6, color = "#0f0")),
            duration = 100,
            delay = 0,
            origin = animation.Origin(0.5, 0.5),
            direction = "alternate",
            fill_mode = "forwards",
            keyframes = [
                animation.Keyframe(
                    percentage = 0.0,
                    transforms = [animation.Rotate(0), animation.Translate(-10, 0), animation.Rotate(0)],
                    curve = "ease_in_out",
                ),
                animation.Keyframe(
                    percentage = 1.0,
                    transforms = [animation.Rotate(360), animation.Translate(-10, 0), animation.Rotate(-360)],
                ),
            ],
        ),
        delay = 20,
    )

    #return render.Root(
    #    child = render.Box(Loader()),
    #    delay = 20,
    #)

    return render.Root(
        child = Orbit(EARTH, 12),
        delay = 20,
    )

    delay = 20

    return render.Root(
        child = Bounce("Hello", 64),
        delay = delay,
    )

    return render.Root(
        child = render.Column([
            render.Marquee(render.Text(content = "Hello World!    ", height = 8), width = 64),
            render.Marquee(render.Text(content = "Hello Tidbyt! Whats up!", height = 8), width = 64),
            Marquee("Hello World!    ", 64, 8),
            Marquee("Hello Tidbyt! Whats up!", 64, 8),
        ]),
        delay = 20,
    )

def Plot():
    return render.Root(
        child = render.Plot(
            data = [
                (0, 3.35),
                (1, 2.15),
                (2, 2.37),
                (3, -0.31),
                (4, -3.53),
                (5, 1.31),
                (6, -1.3),
                (7, 4.60),
                (8, 3.33),
                (9, 5.92),
            ],
            width = 64,
            height = 32,
            color = "#0f0",
            color_inverted = "#f00",
            x_lim = (0, 9),
            y_lim = (-5, 7),
            fill = True,
        ),
    )

def Abs(x):
    return x if x > 0 else -x

def Sign(x):
    return 1 if x > 0 else -1

def Loader():
    diameter = 9
    distance = 9

    return render.Box(
        render.Stack(children = [
            animation.Transformation(
                child = render.Box(render.Circle(diameter = diameter, color = "#f00")),
                duration = 100,
                delay = 0,
                origin = animation.Origin(0.5, 0.5),
                keyframes = [
                    animation.Keyframe(
                        0.0,
                        [animation.Rotate(0), animation.Translate(-distance, 0), animation.Rotate(0)],
                        curve = "ease_in_out",
                    ),
                    animation.Keyframe(
                        1.0,
                        [animation.Rotate(360), animation.Translate(-distance, 0), animation.Rotate(-360)],
                        curve = "ease_in_out",
                    ),
                ],
            ),
            animation.Transformation(
                child = render.Box(render.Circle(diameter = diameter, color = "#0f0")),
                duration = 100,
                delay = 10,
                origin = animation.Origin(0.5, 0.5),
                keyframes = [
                    animation.Keyframe(
                        0.0,
                        [animation.Rotate(0), animation.Translate(-distance, 0), animation.Rotate(0)],
                        curve = "ease_in_out",
                    ),
                    animation.Keyframe(
                        1.0,
                        [animation.Rotate(360), animation.Translate(-distance, 0), animation.Rotate(-360)],
                        curve = "ease_in_out",
                    ),
                ],
            ),
            animation.Transformation(
                child = render.Box(render.Circle(diameter = diameter, color = "#00f")),
                duration = 100,
                delay = 20,
                origin = animation.Origin(0.5, 0.5),
                keyframes = [
                    animation.Keyframe(
                        0.0,
                        [animation.Rotate(0), animation.Translate(-distance, 0), animation.Rotate(0)],
                        curve = "ease_in_out",
                    ),
                    animation.Keyframe(
                        1.0,
                        [animation.Rotate(360), animation.Translate(-distance, 0), animation.Rotate(-360)],
                        curve = "ease_in_out",
                    ),
                ],
            ),
            animation.Transformation(
                child = render.Box(render.Circle(diameter = diameter, color = "#f0f")),
                duration = 100,
                delay = 30,
                origin = animation.Origin(0.5, 0.5),
                keyframes = [
                    animation.Keyframe(
                        0.0,
                        [animation.Rotate(0), animation.Translate(-distance, 0), animation.Rotate(0)],
                        curve = "ease_in_out",
                    ),
                    animation.Keyframe(
                        1.0,
                        [animation.Rotate(360), animation.Translate(-distance, 0), animation.Rotate(-360)],
                        curve = "ease_in_out",
                    ),
                ],
            ),
            animation.Transformation(
                child = render.Box(render.Circle(diameter = diameter, color = "#ff0")),
                duration = 100,
                delay = 40,
                origin = animation.Origin(0.5, 0.5),
                keyframes = [
                    animation.Keyframe(
                        0.0,
                        [animation.Rotate(0), animation.Translate(-distance, 0), animation.Rotate(0)],
                        curve = "ease_in_out",
                    ),
                    animation.Keyframe(
                        1.0,
                        [animation.Rotate(360), animation.Translate(-distance, 0), animation.Rotate(-360)],
                        curve = "ease_in_out",
                    ),
                ],
            ),
            animation.Transformation(
                child = render.Box(render.Circle(diameter = diameter, color = "#0ff")),
                duration = 100,
                delay = 50,
                origin = animation.Origin(0.5, 0.5),
                keyframes = [
                    animation.Keyframe(
                        0.0,
                        [animation.Rotate(0), animation.Translate(-distance, 0), animation.Rotate(0)],
                        curve = "ease_in_out",
                    ),
                    animation.Keyframe(
                        1.0,
                        [animation.Rotate(360), animation.Translate(-distance, 0), animation.Rotate(-360)],
                        curve = "ease_in_out",
                    ),
                ],
            ),
        ]),
        width = 32,
        height = 32,
    )

def Orbit(child, distance):
    return animation.Transformation(
        child = render.Box(child),
        duration = 100,
        delay = 0,
        direction = "normal",
        origin = animation.Origin(0.5, 0.5),
        keyframes = [
            animation.Keyframe(
                0.0,
                [animation.Rotate(0), animation.Translate(-distance, 0), animation.Rotate(0)],
            ),
            animation.Keyframe(
                1.0,
                [animation.Rotate(360), animation.Translate(-distance, 0), animation.Rotate(-360)],
            ),
        ],
    )

# buildifier: disable=integer-division
# buildifier: disable=function-docstring
def Bounce(str, width, delay = 0, always = True):
    text = render.Text(content = str)
    text_width, _ = text.size()
    diff = Abs(width - text_width)
    duration = 2 * diff

    if not always and text_width < width:
        return text

    return animation.Transformation(
        child = text,
        width = width,
        duration = duration,
        delay = delay,
        fill_mode = "backwards",
        direction = "alternate",
        rounding = "round",
        keyframes = [
            animation.Keyframe(0.0, [animation.Translate(0, 0)], "ease_out"),
            animation.Keyframe(1.0, [animation.Translate(diff, 0)], "linear"),
        ],
    )

# buildifier: disable=integer-division
# buildifier: disable=function-docstring
def Marquee(str, width, delay = 0, always = True):
    text = render.Text(content = str)
    text_width, _ = text.size()
    duration = (text_width + width)
    mid = text_width / duration

    if not always and text_width < width:
        return text

    return animation.Transformation(
        child = text,
        width = width,
        duration = duration,
        delay = delay,
        fill_mode = "backwards",
        direction = "normal",
        rounding = "floor",
        keyframes = [
            animation.Keyframe(0.0, [animation.Translate(0, 0)]),
            animation.Keyframe(mid, [animation.Translate(-text_width, 0)]),
            animation.Keyframe(mid, [animation.Translate(width, 0)]),
            animation.Keyframe(1.0, [animation.Translate(1, 0)]),
        ],
    )
`;

type OnChange = (value: string | undefined) => void;

type OnRender = (
  context: CanvasRenderingContext2D,
  timestamp: DOMHighResTimeStamp,
) => void;

type Callbacks = {
  onChange: OnChange;
  onRender: OnRender;
};

function createCallbacks(): Callbacks {
  let lastIndex = -1;
  let then: DOMHighResTimeStamp = 0;
  let result: RenderResult | null = null;

  const onChange = async (code: string | undefined) => {
    if (code !== undefined) {
      try {
        result = await instance.render(code);
        then = window.performance.now();
      } catch (e) {
        if (e instanceof Error) {
          console.error(
            e.message.replace(/^starlark\.ExecFile: code\.star:/g, ''),
          );
        }
      }
    }
  };

  const onRender = (
    context: CanvasRenderingContext2D,
    now: DOMHighResTimeStamp,
  ) => {
    if (result === null) {
      return;
    }

    const diff = now - then;
    if (diff < 0) {
      return;
    }

    const index = Math.floor(diff / result.delay) % result.frames.length;
    if (index !== lastIndex) {
      const frame = result.frames[index]!;
      context.imageSmoothingEnabled = false;

      const ratio = context.canvas.width / frame.width;

      context.drawImage(
        frame,
        0,
        0,
        context.canvas.width,
        frame.height * ratio,
      );
      lastIndex = index;
    }
  };

  return { onChange, onRender };
}

const { onRender, onChange } = createCallbacks();

export const App = (): ReactElement => {
  return (
    <div className={styles.app}>
      <header className={styles.header}></header>
      <section className={styles.editor}>
        <Editor
          theme="vs-dark"
          defaultLanguage="python"
          defaultValue={defaultCode}
          onChange={onChange}
          onMount={(editor) => {
            onChange(editor.getValue());
          }}
        />
      </section>
      <section className={styles.preview}>
        <Canvas onRender={onRender} style={{ imageRendering: 'pixelated' }} />
      </section>
      <footer className={styles.footer}></footer>
    </div>
  );
};
