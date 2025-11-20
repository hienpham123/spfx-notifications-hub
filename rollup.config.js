import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import { readFileSync } from 'fs';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default [
  {
    input: "src/index.ts",
    output: [
      { file: packageJson.main, format: "cjs", sourcemap: true },
      { file: packageJson.module, format: "esm", sourcemap: true },
    ],
    context: "window",
    external: [
      "react",
      "react-dom",
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.peerDependencies || {}),
    ],
    plugins: [
      resolve({
        extensions: [".ts", ".tsx", ".js"],
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        transformMixedEsModules: true,
      }),
      typescript({ 
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        target: "ES2015",
        jsx: "react",
      }),
      postcss({
        inject: false, // Don't inject CSS into JS
        extract: false, // We'll extract in a separate build step
        minimize: true,
      }),
      terser(),
    ],
    onwarn(warning, warn) {
      if (warning.code === "THIS_IS_UNDEFINED") return;
      warn(warning);
    },
  },
  // Separate build step for CSS extraction
  {
    input: "src/styles.css",
    output: [{ file: "dist/css-bundle.js", format: "esm" }],
    plugins: [
      postcss({
        extract: 'index.css',
        minimize: true,
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.css$/, /\.less$/, /\.scss$/],
  },
];

