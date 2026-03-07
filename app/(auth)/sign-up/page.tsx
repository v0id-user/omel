import { Metadata } from 'next';
import { SignUpPage } from '@/features/auth/ui';

export const metadata: Metadata = {
  title: 'أوميل - تسجيل الدخول',
  description: 'تسجيل الدخول إلى أوميل للبدء في إدارة علاقات العملاء الخاصة بك.',
};

export default function SignUp() {
  return <SignUpPage />;
}
