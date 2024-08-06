import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.browser, ...globals.node,...globals.jest }
    },
    rules: {
      semi: ["error", "never"],
     "no-unused-vars": ["error", { args: "none", varsIgnorePattern: "^error$" }],
    },
  },
  pluginJs.configs.recommended,
  {
    ignores: ["node_modules/", "public/", "view/"]
  },
];
