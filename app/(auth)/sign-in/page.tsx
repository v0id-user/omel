import { Metadata } from 'next';
import SignInClientPage from './SignInForm';

export const metadata: Metadata = {
  title: 'أوميل - تسجيل الدخول',
  description: 'تسجيل الدخول إلى أوميل للبدء في إدارة علاقات العملاء الخاصة بك.',
};

export default function SignIn() {
  return <SignInClientPage />;
}
