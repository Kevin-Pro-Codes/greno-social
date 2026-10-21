import React, { useState, useEffect } from 'react';
import { useAuth } from '../support/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/greeno.jpg';

export default function Login({ error: initialError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState(initialError || null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/home');  
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (response.ok) {
        login();
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true'); 
        navigate('/home');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('NETWORK ISSUE. CHECK YOUR INTERNET CONNECTION');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#333333] p-4 box-border">
      <div className="bg-black p-8 sm:p-10 rounded-lg border-2 border-[#a0cc3a] w-full max-w-md text-center shadow-2xl box-border">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Greeno Logo"
            className="w-32 h-32 rounded-full object-cover border-2 border-[#404040] mb-2"
          />
          <h2 className="text-[#a0cc3a] text-3xl font-bold tracking-tight">Greeno Social</h2>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-950/40 border border-red-800/60 rounded p-2 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="loginId"
            placeholder="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#1e1e1e] border border-[#333] text-white rounded focus:outline-none focus:border-[#a0cc3a] transition-colors text-base"
          />
          <input
            name="password"
            type="password"
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
            Log in
          </button>
        </form>

        <p className="text-white text-base mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-400 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}