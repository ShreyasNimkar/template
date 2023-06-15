export default {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script",
  },
  rules: {
    "no-console": "warn",
    "linebreak-style": "off",
    "import/extensions": "off",
    "no-underscore-dangle": "warn",
    "no-param-reassign": "warn",
    "no-unused-vars": "warn",
    "consistent-return": "off",
  },
};
