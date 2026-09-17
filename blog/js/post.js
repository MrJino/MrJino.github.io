const postId = Number(new URLSearchParams(window.location.search).get('id'));
const post = blogPosts.find((item) => item.id === postId);
if (post) {
  window.location.replace(`articles/${post.file.replace(/\.md$/, '.html')}`);
}
