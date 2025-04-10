'use client';
import { NewCRMUserInfo } from '@/interfaces/crm';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TestNewCRM() {
  const [newCRM, setNewCRM] = useState<NewCRMUserInfo>({
    email: 'test@gmail.com',
    password: 'password',
    personalInfo: {
      firstName: 'Test',
      lastName: 'Test',
      phone: '+966511111111',
    },
    companyInfo: {
      name: 'Test Company',
      website: 'https://test.com',
      address: '123 Test St, Test City, Test Country',
      size: '1-9',
    },
  });

  const generateRandomData = () => {
    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
    const companies = ['TechCorp', 'InnovateLabs', 'FutureSystems', 'SmartSolutions', 'GlobalTech'];
    const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    setNewCRM({
      email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
      password: `Pass${Math.random().toString(36).slice(-8)}!`,
      personalInfo: {
        firstName: randomFirstName,
        lastName: randomLastName,
        phone: `+96651111${Math.floor(Math.random() * 10000)}`,
      },
      companyInfo: {
        name: randomCompany,
        website: `https://${randomCompany.toLowerCase()}.example.com`,
        address: `${Math.floor(Math.random() * 999) + 1} ${randomCity} St, ${randomCity}, Saudi Arabia`,
        size: '1-9',
      },
    });
  };

  const router = useRouter();
  if (process.env.NEXT_PUBLIC_ENV !== 'dev') {
    router.push('/');
  }

  const { mutate: createCRM } = trpc.crm.new.create.useMutation();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Test New CRM</h1>
      <button
        className="bg-black cursor-pointer text-white p-2 rounded-md"
        onClick={async () => {
          generateRandomData();
          const result = await createCRM(newCRM);
          console.log(result);
        }}
      >
        Create CRM
      </button>
    </div>
  );
}
