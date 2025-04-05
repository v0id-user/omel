import { parsePhoneNumberFromString } from 'libphonenumber-js';

function clientValidatePhoneInput(phone: string) {
  // Simple general validation
  if (phone.length < 10) return undefined;
  if (phone.length > 15) return undefined;
  if (phone.startsWith('+')) return undefined;
  if (phone.startsWith('00')) return undefined;
  if (phone.startsWith('0')) return undefined;

  const phoneNumber = parsePhoneNumberFromString(phone);
  if (!phoneNumber) return undefined;
  if (!phoneNumber.country) return undefined;
  return phoneNumber;
}

export { clientValidatePhoneInput };
