'use client';

import { signUp } from '@/lib/betterauth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BetterAuthSignUpTest() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('test123123');
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp.email({
        name,
        email,
        password,
      });
      alert('Sign up successful!');
    } catch (error) {
      console.error('Sign up failed:', error);
      alert('Sign up failed. Please check your information.');
    }
  };

  useEffect(() => {
    console.log('signUp', JSON.stringify(signUp, null, 2));
  }, []);

  const router = useRouter();
  if (process.env.NEXT_PUBLIC_ENV !== 'dev') {
    router.push('/');
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <p className="text-sm text-gray-600 mb-4">
        Default test credentials: test@gmail.com / test123123
      </p>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black cursor-pointer text-white p-2 rounded hover:bg-gray-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
