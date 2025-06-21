export function toArabicNumerals(num: number | string): string {
  const easternArabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, d => easternArabicNumerals[parseInt(d)]);
}

export function toEnglishNumerals(num: string): string {
  const easternToWesternMap: Record<string, string> = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
  };

  return num.replace(/[٠-٩]/g, d => easternToWesternMap[d] ?? d);
}
