
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Header';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'signin',
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Store JWT token (you can store it in localStorage, sessionStorage, or a context provider)
      localStorage.setItem('token', data.token);
      router.push('/'); // Redirect to dashboard
    } else {
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div>
      <Header/>
    <div className="bg-white p-8 rounded-lg shadow-lg w-full m-auto max-w-sm">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgotPassword" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
    
  );
}
