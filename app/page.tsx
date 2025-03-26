import Image from 'next/image';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#18191A]">
      <div className="flex-grow flex flex-col justify-center items-center p-4 md:p-6 lg:p-8">
        <Image src="/logo_small.png" alt="logo" width={75} height={75} className="mb-6" />

        <div className="border border-solid border-gray-700 rounded-xl w-full md:w-4/5 lg:w-3/4 xl:w-2/3 p-4 md:p-8 lg:p-12 bg-[#242526]">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <button className="w-full flex items-center justify-center gap-2 p-2 border border-gray-700 rounded-md hover:bg-gray-700/50 transition-colors">
                  <Image src="/google.svg" alt="Google" width={20} height={20} />
                  <span className="text-white">تسجيل الدخول باستخدام جوجل</span>
                </button>
              </div>

              <div className="relative mb-6">
                <input
                  type="email"
                  placeholder="ادخل بريد العمل الخاص بك"
                  className="w-full p-2 pl-10 bg-transparent border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                استمر
              </button>
            </div>

            <div className="w-full md:w-1/2 text-right">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                مرحباً بك في أوميل.
              </h1>
              <p className="text-gray-300">
                أوميل هو نوع جديد تماماً من برامج إدارة علاقات العملاء. مبني على هندسة بيانات مختلفة
                كلياً، ستحصل على ملفات وسجلات لكل تفاعل داخل شبكتك في دقائق، محدثة دائماً في الوقت
                الفعلي.
              </p>
              <p className="text-gray-300 mt-4">
                ستتمكن من تخصيص وإنشاء نظام إدارة علاقات العملاء الخاص بك تماماً كما تريد.
              </p>
              <p className="text-gray-300 mt-4">هيا نبدأ.</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6 text-right">
            بإدخال بريدك الإلكتروني، فإنك توافق على تواصل أوميل معك بخصوص منتجاتنا وخدماتنا. يمكنك
            إلغاء الاشتراك في أي وقت بالنقر على إلغاء الاشتراك في رسائلنا الإلكترونية. اعرف المزيد
            حول كيفية استخدامنا للبيانات في{' '}
            <Link href="/privacy-policy" className="text-blue-400 hover:underline">
              سياسة الخصوصية
            </Link>
            .
          </p>
        </div>
      </div>

      <footer className="p-4 border-t border-gray-700 bg-[#242526]">
        <div className="container mx-auto flex justify-between items-center text-sm text-gray-400">
          <div>© 2025 أوميل</div>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-300">
              سياسة الخصوصية
            </Link>
            <Link href="/support" className="hover:text-gray-300">
              الدعم
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
