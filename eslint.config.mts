import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "jest.config.js"], //ignorar archivos generados y configuración CommonJS
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },

  ...tseslint.configs.recommended,

  prettier,

  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: { ...globals.node }, //... clonamos pero no traemos referencia
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn", //aviso pero te deja continuar, 'error' para que no deje continuar
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
