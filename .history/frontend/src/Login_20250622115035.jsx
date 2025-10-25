import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/greeno.jpg';

export default function Login({ error: initialError }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError || null);
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId, password }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        
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
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body, html {
          height: 100%;
          margin: 0;
          font-family: Arial, sans-serif;
          background: #333;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          background: black;
          padding: 40px 30px;
          border-radius: 8px;
          border: 2px solid #a0cc3a;
          width: 90%;
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }
        .logo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 15px;
        }
        .logo-image {
          margin-bottom: -8px;
        }
        h2 {
          margin-bottom: 24px;
          color: #a0cc3a;
          font-family: 'Calibri', sans-serif;
        }
        .font-greeno {
          color: #a0cc3a;
          font-family: 'Calibri', sans-serif;
          font-weight: bold;
          margin-top: 0;
        }
        .font-white {
          color: white;
          font-family: 'Calibri', sans-serif;
        }
        input {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 14px;
          background-color: #1e1e1e;
          border: 1px solid #333;
          color: #fff;
          border-radius: 4px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }
        input:focus {
          border-color: #a0cc3a;
          outline: none;
        }
        button {
          width: 100%;
          padding: 12px 15px;
          background-color: #a0cc3a;
          border: none;
          border-radius: 4px;
          color: white;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #8caf31;
        }
        a {
          color: #a0cc3a;
          text-decoration: none;
          display: inline-block;
          margin-top: 16px;
          font-size: 14px;
        }
        a:hover {
          text-decoration: underline;
        }
        .error {
          color: #ff4d4d;
          margin: 0;
          margin-bottom: 12px;
          font-size: 14px;
        }
      `}</style>

      <div className="wrapper">
        <div className="container">
          <div className="logo-container">
            <img
              src={logo}
              alt="Greeno Logo"
              className="logo-image"
              width="160"
              height="140"
            />
            <h2 className="font-greeno">Greeno Social</h2>
          </div>

          {error && <p className="error">{error}</p>}

          <form className="login" onSubmit={handleSubmit}>
            <input
            className="font-input"
              name="loginId"
              placeholder="Login"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
            <input
            className="font-input"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" style={{ color: 'black' }}>
              Log in
            </button>
          </form>

          <p className="font-white" style={{ fontSize: '20px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontSize: '20px'}}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}