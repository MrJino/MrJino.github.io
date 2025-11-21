// Navigation 파일을 로드하고 표시
async function loadNavigation(file, category) {
  try {
    console.log('loadNavigation(' + category + ')');
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
  console.log('loadRoadmap(' + topic + ')');
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
async function loadMarkdown(file, category) {
  try {
    const response = await fetch(file);
    const text = await response.text();
    const md = window.markdownit({
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }
        return ''; // use external default escaping
      },
    });

    document.getElementById('content').innerHTML = marked
      .setOptions({
        highlight: function (code, lang) {
          // 언어가 있으면 해당 언어로 하이라이팅, 없으면 자동 감지
          const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language: validLang }).value;
        },
        langPrefix: 'hljs language-', // Highlight.js에서 사용하는 CSS 클래스 설정
      })
      .parse(text)
      .replace('images/', 'article/' + category + '/images/');

    // 코드블록을 하이라이팅
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  } catch (error) {
    document.getElementById(
      'content'
    ).innerHTML = `<p>Error loading file: ${error.message}</p>`;
  }
}

async function loadContents() {
  console.log('loadContents()');

  const params = new URLSearchParams(window.location.search);
  const topic = params.get('topic');

  if (topic) {
    const category = topic.split('_')[0];
    loadNavigation('navigation/navigation.html', category);
    loadMarkdown('article/' + category + '/' + topic + '.md', category);
    loadRoadmap('roadmap/' + category + '.html', topic);
  } else {
    loadNavigation('navigation/navigation.html', '');
  }
}
