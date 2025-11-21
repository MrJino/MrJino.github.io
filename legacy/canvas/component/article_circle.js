import {
  getPrimaryColor,
  getBorderColor,
  getPrimaryDimColor,
  getBorderDimColor,
} from '../theme/color.js';

export function ArticleCircle(
  ctx,
  posX,
  posY,
  radius,
  main_title,
  sub_title,
  focused
) {
  // 원 그리기
  ctx.beginPath();
  ctx.arc(posX, posY, radius, 0, 2 * Math.PI, false);

  // 원의 스타일 지정 (선 색과 채우기 색)
  ctx.fillStyle = focused ? getPrimaryColor() : getPrimaryDimColor();
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = focused ? getBorderColor() : getBorderDimColor();
  ctx.stroke();

  // 텍스트 스타일 설정
  ctx.font = '24px serif';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  // 텍스트 그리기 (채워진 텍스트)
  ctx.fillText(main_title, posX, posY);

  // 텍스트 스타일 설정
  ctx.font = '16px Verdana';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // 텍스트 그리기 (채워진 텍스트)
  ctx.fillText(sub_title, posX, posY + 10);
}
