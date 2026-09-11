const dialog = document.getElementById('project-dialog');
const dialogContent = document.getElementById('dialog-content');
const closeButton = document.getElementById('close-project');
let opener = null;
let savedScrollY = 0;
let savedBodyStyles = null;

function openProject(button) {
  const template = document.getElementById(`${button.dataset.project}-content`);
  if (!template || dialog.open) return;
  opener = button;
  const content = template.content.cloneNode(true);
  content.querySelector('h3').id = 'dialog-title';
  dialogContent.replaceChildren(content);
  savedScrollY = window.scrollY;
  savedBodyStyles = {
    position: document.body.style.position,
    top: document.body.style.top,
    width: document.body.style.width,
  };
  // Keep the document still, including on touch devices.
  Object.assign(document.body.style, { position: 'fixed', top: `-${savedScrollY}px`, width: '100%' });
  dialog.showModal();
  dialog.scrollTop = 0;
  closeButton.focus({ preventScroll: true });
}

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => openProject(button));
});
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    dialog.close();
  }
});
dialog.addEventListener('close', () => {
  if (savedBodyStyles) Object.assign(document.body.style, savedBodyStyles);
  window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  opener?.focus({ preventScroll: true });
  dialogContent.replaceChildren();
  opener = null;
  savedBodyStyles = null;
});

const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.work-card');
const categoryHeadings = document.querySelectorAll('[data-category-heading]');
filters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    let visibleCount = 0;
    cards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) visibleCount += 1;
    });
    categoryHeadings.forEach((heading) => {
      heading.hidden = filter !== 'all' && heading.dataset.categoryHeading !== filter;
    });
    document.getElementById('work-count').textContent = document.documentElement.lang === 'en' ? `${visibleCount} projects` : `${visibleCount}개의 프로젝트`;
  });
});
