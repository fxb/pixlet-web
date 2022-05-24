# pixlet-web

Edit and run Tidbyt pixlet apps inside your browser!

## Dependencies

1. Install [Go](https://go.dev/doc/install)

2. Build Pixlet WASM target from the [wasm](https://github.com/fxb/pixlet/tree/wasm) branch of my fork and copy it to `dist` directory.

3. Install packages:

`yarn install`

## Build

`yarn run build`

or

`yarn run watch`

## Run

You need to run some local server in the `dist` directory to run the output, as browsers don't load a WASM binary from `file:///` URLs.

e.g.

`python3 -m http.server`
