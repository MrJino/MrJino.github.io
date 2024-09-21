function focusRoadmap(topic) {
  console.log('focusRoadmap(' + topic + ')');

  const focusElements = document.getElementsByClassName('article_circle');
  Array.from(focusElements).forEach((element) => {
    const elementName = element.getAttribute('name');
    if (elementName === topic) {
      element.classList.add('focused');
    } else {
      element.classList.add('pointer');
      element.addEventListener('click', function () {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('topic', elementName);
        window.location.href = currentUrl.toString();
      });
    }
  });
}
