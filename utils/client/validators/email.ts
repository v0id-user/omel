import { z } from 'zod';

function clientValidateEmailInput(email: string) {
  if (!email) {
    return 'يجب إدخال بريد العمل الخاص بك';
  }

  if (!z.string().email().safeParse(email).success) {
    return 'بريد العمل الإلكتروني غير صالح';
  }

  return undefined;
}

export { clientValidateEmailInput };
