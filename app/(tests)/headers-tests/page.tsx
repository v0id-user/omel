'use client';

import { trpc } from '@/trpc/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HeadersSetting() {
  const { data: cookies } = trpc.headerTests.getRequestCookies.useQuery();
  const { data: headers } = trpc.headerTests.getRequestHeaders.useQuery({
    headerName: 'user-agent',
  });

  const { mutate: setCookie } = trpc.headerTests.setCookie.useMutation();
  const { mutate: setHeader } = trpc.headerTests.setHeader.useMutation();

  const router = useRouter();
  if (process.env.NEXT_PUBLIC_ENV !== 'dev') {
    router.push('/');
  }

  useEffect(() => {
    setCookie({
      maxAge: 60 * 60 * 24 * 30,
      name: 'test-cookie',
      value: 'test-value',
    });

    setHeader({
      name: 'x-user-agent',
      value: 'test-value',
    });
  }, [setCookie, setHeader]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>HeadersSetting</h1>
      <pre>{JSON.stringify(cookies, null, 2)}</pre>
      <pre>{JSON.stringify(headers, null, 2)}</pre>
    </div>
  );
}
