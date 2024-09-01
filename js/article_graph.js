const params = new URLSearchParams(window.location.search);
const step = params.get('step');

const focusElements = document.getElementsByClassName('article_circle');
Array.from(focusElements).forEach((element) => {
  const elementName = element.getAttribute('name');
  if (elementName === step) {
    element.classList.add('focused');
  } else {
    element.classList.add('pointer');
    element.addEventListener('click', function () {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('step', elementName);
      window.location.href = currentUrl.toString();
    });
  }
});
