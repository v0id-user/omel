export function mapSignInErrorToArabic(
  error: { message?: string; status?: number; code?: string } | null | undefined
): string {
  if (!error) return 'خطأ في تسجيل الدخول';

  const msg = (error.message ?? '').toLowerCase();
  const status = error.status;
  const code = error.code;

  if (status === 429) return 'محاولات كثيرة، يرجى المحاولة لاحقاً';
  if (code === 'email_not_found') return 'البريد الإلكتروني غير مسجل';
  if (msg.includes('invalid password')) return 'كلمة المرور غير صحيحة';
  if (
    msg.includes('invalid credentials') ||
    msg.includes('email not found') ||
    msg.includes('user not found')
  ) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  }

  return 'خطأ في تسجيل الدخول';
}
