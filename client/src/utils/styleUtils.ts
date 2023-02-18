export function px2vw(px: number, psd = 1920): string {
  return `${(px / psd) * 100}vw`;
}
