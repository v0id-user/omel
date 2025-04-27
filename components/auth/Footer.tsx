import Link from 'next/link';

const AuthFooter = () => {
  return (
    <footer className="p-4">
      <div className="container flex flex-col sm:flex-row mx-auto gap-2 justify-center items-center text-sm text-gray-400">
        <div>© 2025 أوميل</div>
        <div className="flex gap-4">
          <Link href="/legal/privacy" prefetch={true} className="hover:text-gray-300 underline">
            سياسة الخصوصية
          </Link>
          <Link href="/support" prefetch={true} className="hover:text-gray-300 underline">
            الدعم
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;
