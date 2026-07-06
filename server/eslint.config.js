// ESLint flat config. Lints only the hand-written code; the generated server
// (src/index.ts) and all build output are ignored. Keep this list in sync with
// the hand-written files in src/ if more are added.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["build/", "build-test/", "src/index.ts"],
  },
  {
    files: ["src/auth.ts", "src/auth.test.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-console": ["error", { allow: ["error", "warn"] }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
