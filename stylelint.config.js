export default {
  extends: [
    "stylelint-config-standard",
    "@stylistic/stylelint-config",
    "stylelint-config-recess-order"
  ],
  plugins: [
    "stylelint-declaration-block-no-ignored-properties",
    "stylelint-order",
    "stylelint-rem-over-px"
  ],
  rules: {
    "@stylistic/selector-list-comma-newline-after": "always-multi-line",
    "at-rule-empty-line-before": "never",
    "declaration-empty-line-before": "never",
    "plugin/declaration-block-no-ignored-properties": true,
    "rule-empty-line-before": "never"
  }
};
