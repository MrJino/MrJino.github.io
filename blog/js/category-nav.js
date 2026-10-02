(() => {
  const catalog = window.MrJinoBlogCatalog;
  if (!catalog) throw new Error('MrJinoBlogCatalog must be loaded before category-nav.js');

  const itemClasses = ['category-item', 'w-full', 'px-4', 'py-3', 'rounded-lg', 'flex', 'items-center', 'justify-between'];

  function getCategoryFromLocation() {
    const category = new URLSearchParams(window.location.search).get('category');
    return catalog.categories.includes(category) ? category : '전체';
  }

  function render(container, requestedCategory) {
    if (!container) return;
    const activeCategory = catalog.categories.includes(requestedCategory)
      ? requestedCategory
      : getCategoryFromLocation();
    const fragment = document.createDocumentFragment();

    catalog.categories.forEach((category) => {
      const link = document.createElement('a');
      link.href = category === '전체' ? './' : `./?category=${encodeURIComponent(category)}`;
      link.classList.add(...itemClasses);
      link.dataset.category = category;
      if (category === activeCategory) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }

      const label = document.createElement('span');
      label.textContent = category;
      const count = document.createElement('span');
      count.className = 'text-sm';
      count.textContent = String(catalog.getCategoryCount(category));
      link.append(label, count);
      fragment.append(link);
    });

    container.replaceChildren(fragment);
  }

  function renderAll() {
    document.querySelectorAll('[data-category-nav]').forEach((container) => {
      render(container, container.dataset.activeCategory);
    });
  }

  window.MrJinoBlogCategoryNav = Object.freeze({ render, renderAll });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll, { once: true });
  } else {
    renderAll();
  }
})();
