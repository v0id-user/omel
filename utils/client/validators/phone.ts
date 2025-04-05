import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';

// List of allowed Arab country codes
const ALLOWED_ARAB_COUNTRIES = [
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
  if (!phone) return null;

  try {
    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber) return null;

    // Check if the phone number is valid and belongs to an allowed country
    if (
      phoneNumber.isValid() &&
      phoneNumber.country &&
      ALLOWED_ARAB_COUNTRIES.includes(phoneNumber.country)
    ) {
      return phoneNumber;
    }
  } catch (error) {
    console.error('Phone validation error:', error);
  }

  return null;
}

export { clientValidatePhoneInput, ALLOWED_ARAB_COUNTRIES };
