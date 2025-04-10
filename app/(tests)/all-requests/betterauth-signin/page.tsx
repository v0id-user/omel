'use client';

import { signIn } from '@/lib/betterauth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function BetterAuthSignInTest() {
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('test123123');

  const router = useRouter();
  if (process.env.NEXT_PUBLIC_ENV !== 'dev') {
    router.push('/');
  }
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn.email({
        email,
        password,
      });
      alert('Sign in successful!');
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed. Please check your credentials.');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <p className="text-sm text-gray-600 mb-4">
        Default test credentials: test@gmail.com / test123123
      </p>
      <form onSubmit={handleSignIn} className="space-y-4">
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
          Sign In
        </button>
      </form>
    </div>
  );
}
