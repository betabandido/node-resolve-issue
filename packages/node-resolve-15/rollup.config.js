import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import path from "path";
import * as pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        dir: path.dirname(pkg.module),
        format: "esm",
      },
      {
        dir: path.dirname(pkg.main),
        format: "cjs",
      },
    ],
    plugins: [
      json(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
];
