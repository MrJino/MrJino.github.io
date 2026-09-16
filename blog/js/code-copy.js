async function copyCodeText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand('copy');
  textArea.remove();
  if (!copied) throw new Error('Copy command failed');
}

function enhanceCodeBlocks(root) {
  root.querySelectorAll('pre').forEach((pre) => {
    if (pre.parentElement?.classList.contains('code-block')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy-button';
    button.textContent = '복사';
    button.setAttribute('aria-label', '코드 복사');

    pre.before(wrapper);
    wrapper.append(pre, button);
    pre.tabIndex = 0;

    button.addEventListener('click', async () => {
      window.clearTimeout(Number(button.dataset.resetTimer || 0));
      try {
        await copyCodeText(pre.textContent || '');
        button.textContent = '복사됨';
        button.setAttribute('aria-label', '코드가 복사되었습니다');
        button.classList.add('is-copied');
      } catch (error) {
        console.error('Code copy failed:', error);
        button.textContent = '실패';
        button.setAttribute('aria-label', '코드 복사에 실패했습니다');
        button.classList.add('is-copied');
      }

      button.dataset.resetTimer = String(window.setTimeout(() => {
        button.textContent = '복사';
        button.setAttribute('aria-label', '코드 복사');
        button.classList.remove('is-copied');
        delete button.dataset.resetTimer;
      }, 1800));
    });
  });
}
