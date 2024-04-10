/** @type {import("prettier").Config} */
module.exports = {
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  endingPosition: 'absolute-with-indent',
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-classnames',
    'prettier-plugin-merge',
  ],
}
