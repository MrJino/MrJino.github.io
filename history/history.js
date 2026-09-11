const tabs = [...document.querySelectorAll('[data-history-tab]')];
const panels = [...document.querySelectorAll('[data-history-panel]')];

function selectHistory(category, focusTab = false) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.historyTab === category;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focusTab) tab.focus();
  });
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.historyPanel !== category;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectHistory(tab.dataset.historyTab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    selectHistory(tabs[nextIndex].dataset.historyTab, true);
  });
});
