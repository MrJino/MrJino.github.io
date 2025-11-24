# How I Built This Blog

Building a static blog doesn't always require a complex framework like Next.js or Gatsby. Sometimes, a simple approach is best.

## The Stack

- **HTML5**: For structure.
- **Tailwind CSS**: For styling. I used the CDN version for quick prototyping.
- **JavaScript**: To fetch the post list and render markdown.
- **Marked.js**: A fast markdown parser.

## How it works

1. `index.html` fetches `posts.json` to display the list.
2. Clicking a post navigates to `post.html?id=post-id`.
3. `post.html` reads the ID, fetches the corresponding `.md` file, and renders it.

Simple and effective!
