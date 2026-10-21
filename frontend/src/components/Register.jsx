import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register({ error: initialError }) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [error, setError] = useState(initialError || '');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setError('');

    if (username.charAt(0) !== username.charAt(0).toUpperCase()) {
      setUsernameError('❌ USERNAME MUST START WITH UPPERCASE LETTER');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#333333] p-4 box-border">
      <div className="bg-black p-8 sm:p-10 rounded-lg border-2 border-[#a0cc3a] w-full max-w-md text-center shadow-2xl box-border">
        <h2 className="text-[#a0cc3a] text-3xl font-bold tracking-tight mb-6">
          Registration
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-950/40 border border-red-800/60 rounded p-2 font-medium">
            {error}
          </p>
        )}
        {usernameError && (
          <div className="text-red-500 text-sm mb-4 bg-red-950/40 border border-red-800/60 rounded p-2 font-medium">
            {usernameError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333] text-white rounded focus:outline-none focus:border-[#a0cc3a] transition-colors text-base"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333] text-white rounded focus:outline-none focus:border-[#a0cc3a] transition-colors text-base"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333] text-white rounded focus:outline-none focus:border-[#a0cc3a] transition-colors text-base"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333] text-white rounded focus:outline-none focus:border-[#a0cc3a] transition-colors text-base"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#a0cc3a] hover:bg-[#8caf31] text-black font-bold text-base rounded cursor-pointer transition-colors duration-200 mt-2 shadow-md"
          >
            Register
          </button>
        </form>

        <p className="text-white text-base mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
