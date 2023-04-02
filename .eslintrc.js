module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@custom-lb/eslint-config`
  extends: ["@custom-lb/eslint-config"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
