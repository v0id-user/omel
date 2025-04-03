function clientValidatePasswordInput(password: string) {
  if (!password) {
    return 'يجب إدخال كلمة المرور';
  }

  if (password.length < 8) {
    return 'يجب أن يكون كلمة المرور أطول من 8 أحرف';
  }

  return undefined;
}

export { clientValidatePasswordInput };
