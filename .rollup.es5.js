import pkg from "./package.json"; // { pkg.rollup.output.es5.* }

import path from "path";
import resolve from "rollup-plugin-node-resolve"; // resolve node_modules/index.js to ES6
import commonjs from "rollup-plugin-commonjs";    // convert CommonJS -> ES6
import buble from "rollup-plugin-buble";          // convert ES6 -> ES5
import { eslint } from "rollup-plugin-eslint";        // ESLint
import cleanup from "rollup-plugin-cleanup";      // clear comments and empty lines
//import license from "rollup-plugin-license";      // add License header

// --- ES5/ES6/CommonJS/ESModules -> ES5 bundle ---
export default {
  input: pkg.rollup.es5.input,
  output: {
    file: pkg.rollup.es5.output,
    format: "iife", // wrap (function(){ code })();
    name: pkg.rollup.es5.name,
    //intro: "",
    //outro: "",
    //banner: `if (typeof ${pkg.rollup.output.es5.name} === "undefined") { // avoid duplicate import`,
    //footer: `}`,
  },
  plugins: [
    resolve({ mainFields: ['module'] }),
    commonjs(),
    buble(), // ES6 -> ES5
    eslint({ configFile: path.resolve("./.eslintrc.es5.json") }),
    cleanup(),
    // license({
    //   banner: "Copyright 2019 xxxx",
    //   //thirdParty: {
    //   //  output: path.join(__dirname, "dependencies.txt"),
    //   //  includePrivate: true, // Default is false.
    //   //},
    // }),
  ],
}
