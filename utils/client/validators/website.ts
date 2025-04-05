function validateWebsite(website: string) {
  if (website && !website.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
    return 'الموقع الإلكتروني غير صالح';
  }
  return undefined;
}

export { validateWebsite };
