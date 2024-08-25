const primaryColor = 0xbee9ff;
const borderColor = 0x89cff0;
const primaryDimColor = 0xeeeeee;
const borderDimColor = 0xcccccc;

export function getPrimaryColor() {
  return getColor(primaryColor);
}

export function getPrimaryDimColor() {
  return getColor(primaryDimColor);
}

export function getBorderColor() {
  return getColor(borderColor);
}

export function getBorderDimColor() {
  return getColor(borderDimColor);
}

function getColor(hex) {
  return `#${hex.toString(16).padStart(6, '0')}`;
}
