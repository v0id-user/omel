import { log } from '@/utils/logs';
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

  if (phone[0] !== '+') {
    const fixed = '+' + phone;
    phone = fixed;
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(phone);
    console.log(
      log({
        component: 'clientValidatePhoneInput',
        message: `Parsed phone number: ${phoneNumber} Passed phone number: ${phone}`,
      })
    );

    if (!phoneNumber) {
      return 'رقم الهاتف يبدو غير صحيحا';
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
      console.log('Phone number is valid', phone, phoneNumber);
      return undefined;
    }
    console.log('Phone number is invalid', phone, phoneNumber);
  } catch (error) {
    console.error('Phone validation error:', error);
  }

  console.log('Phone number is invalid', phone);
  return 'يجب إدخال رقم الهاتف بشكل صالح';
}

export { clientValidatePhoneInput, ALLOWED_COUNTRIES };
