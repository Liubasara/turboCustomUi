module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@custom-lb-ui/eslint-config`
  extends: ["@custom-lb-ui/eslint-config"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
