/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './portfolio/**/*.html',
    './portfolio/**/*.js',
    './profile/**/*.html',
    './history/**/*.html',
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
