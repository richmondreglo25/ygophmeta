import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "_output/**",
      "_site/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
