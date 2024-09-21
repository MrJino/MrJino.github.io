// Navigation 파일을 로드하고 표시
async function loadNavigation(file, category) {
  try {
    console.log('loadNavigation');
    const parser = new DOMParser();
    const html = await (await fetch(file)).text();
    const htmlRoot = parser.parseFromString(html, 'text/html');
    const htmlBody = htmlRoot.body.innerHTML;
    document.getElementById('navigation').innerHTML = htmlBody;
    focusNavigation(category);
  } catch (error) {
    document.getElementById(
      'roadmap'
    ).innerHTML = `<p>Error loading file: ${error.message}</p>`;
  }
}

// Graph 로드맵 파일을 로드하고 표시
async function loadRoadmap(file, topic) {
  try {
    const parser = new DOMParser();
    const html = await (await fetch(file)).text();
    const htmlRoot = parser.parseFromString(html, 'text/html');
    const htmlBody = htmlRoot.body.innerHTML;
    document.getElementById('roadmap').innerHTML = htmlBody;
    focusRoadmap(topic);
  } catch (error) {
    document.getElementById(
      'roadmap'
    ).innerHTML = `<p>Error loading file: ${error.message}</p>`;
  }
}

// Markdown 파일을 로드하고 표시하는 함수
async function loadMarkdown(file, topic) {
  try {
    const response = await fetch(file);
    const text = await response.text();
    document.getElementById('content').innerHTML = marked
      .parse(text)
      .replace('images/', 'article/' + topic + '/images/');
  } catch (error) {
    document.getElementById(
      'content'
    ).innerHTML = `<p>Error loading file: ${error.message}</p>`;
  }
}

async function loadContents() {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get('topic');

  if (topic) {
    const category = topic.split('_')[0];
    loadNavigation('navigation/navigation.html', category);
    loadMarkdown('article/' + topic + '/topic.md', topic);
    loadRoadmap('roadmap/' + category + '.html', topic);
  } else {
    loadNavigation('navigation/navigation.html', '');
  }
}
