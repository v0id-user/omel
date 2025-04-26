import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

const WelcomeEmail = ({ recipientEmail }: { recipientEmail: string }) => {
  const currentDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]" dir="rtl">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px]" dir="rtl">
            {/* ترويسة مع اسم المنصة */}
            <Section className="text-right mb-[20px]">
              <Heading
                className="text-[24px] font-bold text-gray-800 m-0"
                dir="rtl"
                style={{ textAlign: 'right' }}
              >
                منصة أوميل
              </Heading>
              <Text
                className="text-[14px] text-gray-500 mt-[4px] mb-0"
                dir="rtl"
                style={{ textAlign: 'right' }}
              >
                {currentDate} - {currentTime}
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[20px]" />

            {/* محتوى الرسالة - رسالة ترحيبية للتسجيل */}
            <Section className="mb-[32px]">
              <Heading
                className="text-[18px] font-bold text-gray-800 mb-[12px]"
                dir="rtl"
                style={{ textAlign: 'right' }}
              >
                مرحباً بك في منصة أوميل!
              </Heading>
              <Text
                className="text-[16px] text-gray-600 mb-[16px]"
                dir="rtl"
                style={{ textAlign: 'right' }}
              >
                نشكرك على تسجيلك في منصة أوميل لإدارة العلاقات. نحن سعداء بانضمامك إلى مجتمعنا.
              </Text>
              <Text
                className="text-[16px] text-gray-600 mb-[16px]"
                dir="rtl"
                style={{ textAlign: 'right' }}
              >
                تم تفعيل حسابك بنجاح، ويمكنك الآن الاستفادة من جميع خدمات المنصة لتحسين إدارة
                علاقاتك مع العملاء وتطوير أعمالك.
              </Text>
              <Text
                className="text-[16px] text-gray-600 mb-[16px]"
                dir="rtl"
                style={{ textAlign: 'right' }}
              >
                للبدء، يمكنك تسجيل الدخول إلى حسابك واستكشاف الميزات المتاحة. إذا كنت بحاجة إلى أي
                مساعدة، فلا تتردد في التواصل مع فريق الدعم الفني.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[20px]" />

            {/* تذييل مع روابط */}
            <Section className="text-center">
              <Text className="text-[14px] text-gray-500 mb-[8px]" dir="rtl">
                <Link href="https://omel.im/privacy" className="text-gray-400 underline mx-[8px]">
                  سياسة الخصوصية
                </Link>
                <span className="mx-[4px]">•</span>
                <Link href="https://omel.im/terms" className="text-gray-400 underline mx-[8px]">
                  شروط الاستخدام
                </Link>
                <span className="mx-[4px]">•</span>
                <Link
                  href={`https://omel.im/unsubscribe?email=${recipientEmail}`}
                  className="text-gray-400 underline mx-[8px]"
                >
                  إلغاء الاشتراك
                </Link>
              </Text>
              <Text className="text-[12px] text-gray-400 m-0" dir="rtl">
                © {new Date().getFullYear()} جميع الحقوق محفوظة لبرنامج إدارة العلاقات "أوميل"
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
