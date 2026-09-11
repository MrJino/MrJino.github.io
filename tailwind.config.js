/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './about/**/*.html',
    './about/**/*.js',
    './course/**/*.html',
    './course/**/*.js',
    './blog/index.html',
    './blog/post.html',
    './blog/js/**/*.js',
    './blog/posts/**/*.md',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
