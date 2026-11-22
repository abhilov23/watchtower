import globals from "globals";
import { config as baseConfig } from "@repo/eslint-config/base";

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
