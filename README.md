# Example code to reproduce issue with @rollup/plugin-node-resolve

This example contains two dummy packages that import `@laverdet/lokesh-colorthief`, which in turn imports code from a dependant package (`get-pixels`). Depending on the specific `@rollup/plugin-node-resolve` version used, the generated bundle contains code either from the `main` entry in package.json or the `module` entry for the `get-pixels` dependency.

This creates issues when `@laverdet/lokesh-colorthief` is being used in a bundle that it is supposed to be run in a browser.

Build instructions:

```shell
pnpm install
pnpm lerna run build
```

This will build both packages (one using `@rollup/plugin-node-resolve` version 13 and the other one version 15). By looking at the contents of the `dist` folder (e.g., files `dist/esm/index.js`) it is possible to see how the bundle generated with version 13 uses the code from the `module` entry, while the one generated with version 15 uses the code from the `main` entry.
