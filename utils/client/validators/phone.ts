import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';

const ALLOWED_COUNTRIES = [
  'SA', // Saudi Arabia
  'AE', // UAE
  'EG', // Egypt
  'QA', // Qatar
  'KW', // Kuwait
  'BH', // Bahrain
  'OM', // Oman
  'JO', // Jordan
  'LB', // Lebanon
  'SY', // Syria
  'IQ', // Iraq
  'YE', // Yemen
  'MA', // Morocco
  'DZ', // Algeria
  'TN', // Tunisia
  'LY', // Libya
  'SD', // Sudan
  'PS', // Palestine
];

function clientValidatePhoneInput(phone: string) {
  if (!phone) {
    return 'يجب إدخال رقم الهاتف';
  }

  if (phone[0] !== '+') {
    const fixed = '+' + phone;
    phone = fixed;
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber) {
      return 'رقم الهاتف يبدو غير صحيحا';
    }

    // Check if the phone number is valid and belongs to an allowed country
    const isValid = phoneNumber.isValid();
    const country = phoneNumber.country;
    const isAllowedCountry = country && ALLOWED_COUNTRIES.includes(country);

    if (isValid && country && isAllowedCountry) {
      return undefined;
    }
  } catch (error) {
    console.error('Phone validation error:', error);
  }

  return 'يجب إدخال رقم الهاتف بشكل صالح';
}

export { clientValidatePhoneInput, ALLOWED_COUNTRIES };
