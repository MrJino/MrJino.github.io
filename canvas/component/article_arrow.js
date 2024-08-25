import {
  getPrimaryColor,
  getBorderColor,
  getPrimaryDimColor,
} from '../theme/color.js';

export function ArticleArrow(
  ctx,
  fromX,
  fromY,
  toX,
  toY,
  headLength = 12,
  color = 'lightGray'
) {
  const angle = Math.atan2(toY - fromY, toX - fromX); // 선의 각도 계산

  // 화살표 선 그리기
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX - 5, toY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();

  // 화살표 머리 그리기 (삼각형)
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.lineTo(toX, toY);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
