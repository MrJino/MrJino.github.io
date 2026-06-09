(function () {
  const navigationItems = [
    {
      id: 'portfolio',
      href: '../portfolio',
      label: 'About',
      icon: '../assets/icons/portfolio-user.svg',
    },
    {
      id: 'blog',
      href: '../blog',
      label: 'Blog',
      icon: '../assets/icons/blog-book.svg',
    },
    {
      id: 'history',
      href: '../history',
      label: 'History',
      icon: '../assets/icons/history-clock.svg',
    },
    {
      id: 'playground',
      href: '../playground',
      label: 'Play',
      icon: '../assets/icons/playground-grid.svg',
    },
  ];

  function createNavigationDropdownMarkup(currentPage) {
    const items = navigationItems
      .filter((item) => item.id !== currentPage)
      .map(
        (item) => `
          <a href="${item.href}" class="dropdown-item">
            <img src="${item.icon}" alt="" class="w-4 h-4" aria-hidden="true" />
            ${item.label}
          </a>
        `,
      )
      .join('');

    return `
      <div class="dropdown site-dropdown">
        <button
          onclick="toggleDropdown()"
          class="w-full px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-950 rounded-lg transition-all flex items-center justify-start gap-2 text-left text-gray-800 hover:text-black"
        >
          <img src="../assets/icons/chevron-down.svg" alt="" class="w-4 h-4" aria-hidden="true" />
          이동하기
        </button>
        <div id="dropdownMenu" class="dropdown-menu">
          ${items}
        </div>
      </div>
    `;
  }

  function renderNavigationDropdown() {
    const mount = document.getElementById('navigationDropdown');

    if (!mount) {
      return;
    }

    mount.innerHTML = createNavigationDropdownMarkup(mount.dataset.current);
  }

  window.toggleDropdown = function () {
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (dropdownMenu) {
      dropdownMenu.classList.toggle('show');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNavigationDropdown);
  } else {
    renderNavigationDropdown();
  }
})();
