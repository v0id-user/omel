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
  console.log('Validating phone number:', phone);

  if (!phone) {
    return 'يجب إدخال رقم الهاتف';
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(phone);
    console.log('Parsed phone number:', phoneNumber);

    if (!phoneNumber) {
      return 'يجب إدخال رقم الهاتف';
    }

    // Check if the phone number is valid and belongs to an allowed country
    const isValid = phoneNumber.isValid();
    const country = phoneNumber.country;
    const isAllowedCountry = country && ALLOWED_COUNTRIES.includes(country);

    console.log('Phone validation results:', {
      isValid,
      country,
      isAllowedCountry,
    });

    if (isValid && country && isAllowedCountry) {
      return undefined;
    }
  } catch (error) {
    console.error('Phone validation error:', error);
  }

  console.log('Phone number is invalid');
  return 'يجب إدخال رقم الهاتف بشكل صالح';
}

export { clientValidatePhoneInput, ALLOWED_COUNTRIES };
