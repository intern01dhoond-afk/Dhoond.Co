// Re-export from the single source of truth
export { getCategoryIcon } from '../components/blog/categoryIcons';

const ALLOWED_TAGS = new Set([
  'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'a', 'br',
]);

export function getAuthorInitials(author = '') {
  return author
    .split(' ')
    .filter(Boolean)
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function sanitizeBlogHtml(html = '') {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  doc.querySelectorAll('script, iframe, object, embed, form, style, link').forEach((el) => {
    el.remove();
  });

  doc.body.querySelectorAll('*').forEach((el) => {
    if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
      el.replaceWith(...el.childNodes);
      return;
    }

    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();

      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        return;
      }

      if (name === 'href' && value.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
        return;
      }

      if (!['href', 'target', 'rel', 'class'].includes(name)) {
        el.removeAttribute(attr.name);
      }
    });

    if (el.tagName.toLowerCase() === 'a') {
      el.setAttribute('rel', 'noopener noreferrer');
      if (el.getAttribute('target') === '_blank') {
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  return doc.body.innerHTML;
}

export function filterBlogPosts(posts, { category, searchQuery }) {
  const query = searchQuery.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesCategory = category === 'All' || post.category === category;
    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}


