import neostandard from "neostandard";

export default [
  ...neostandard({
    env: ["browser"],
    ts: false,
    noJsx: true,
    semi: true
  }),
  {
    rules: {
      "@stylistic/brace-style": "off",
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/operator-linebreak": ["error", "after"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/space-before-function-paren": ["error", { anonymous: "always", asyncArrow: "always", named: "never" }]
    }
  }
];
