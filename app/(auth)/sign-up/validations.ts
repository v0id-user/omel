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

function clientValidatePasswordInput(password: string) {
  if (!password) {
    return 'يجب إدخال كلمة المرور';
  }

  if (password.length < 8) {
    return 'يجب أن يكون كلمة المرور أطول من 8 أحرف';
  }

  return undefined;
}

export { clientValidateEmailInput, clientValidatePasswordInput };
