import { ArticleCircle } from './component/article_circle.js';
import { ArticleArrow } from './component/article_arrow.js';

export function showArticleGraph(canvas) {
  // canvas 요소 가져오기
  const ctx = canvas.getContext('2d');

  canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  });

  const circle_radius = 80;
  const arrow_length = 50;
  let posX = 100;
  let posY = canvas.height / 2;

  ArticleCircle(
    ctx,
    posX,
    posY,
    circle_radius,
    'Firebase',
    '프로젝트 세팅',
    true
  );

  posX += circle_radius;
  ArticleArrow(ctx, posX, posY, posX + arrow_length, posY); // 수평 화살표

  posX += arrow_length + circle_radius;
  ArticleCircle(ctx, posX, posY, circle_radius, 'Firebase', 'Authentication');
}
