import React, { useState } from 'react';
import { Link } from 'react-router-dom';



export default function Register({ error }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();
  setUsernameError('');

  if (username.charAt(0) !== username.charAt(0).toUpperCase()) {
    setUsernameError('❌ USERNAME MUST START WITH UPPERCASE LETTER');
    return;
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      //alert('Registration successful!');
    
      window.location.href = '/login';
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Server error. Please try again later.');
  }
};


  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        html, body {
          height: 100%;
          margin: 0;
          font-family: Arial, sans-serif;
          background: #333;
        }
        .wrapper {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
          background: black;
          padding: 40px 30px;
          border-radius: 8px;
          border: 2px solid #a0cc3a;
          width: 90%;
          max-width: 500px;
          text-align: center;
        }
        h2 {
          margin-bottom: 24px;
          color: #a0cc3a;
          font-family: 'Calibri', sans-serif;
          font-weight: bold;
        }
        .font-white {
          color: white;
          font-family: 'Calibri', sans-serif;
        
        }

        .font-input {
            font-size: 20px;
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
          color: black;
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
          margin-top: 12px;
          margin-bottom: 5px;
          font-size: 14px;
        }
      `}</style>

      <div className="wrapper">
        <div className="container">
          <h2>Registration</h2>

          {error && <p className="error">{error}</p>}
          {usernameError && <div className="error">{usernameError}</div>}

          <form onSubmit={handleSubmit}>
            <input
            className="font-input"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
            className="font-input"
              type="email"
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
            className="font-input"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" style={{ color: 'black', textDecoration: 'none' }}>
              Register
            </button>
          </form>

          <p className="font-white" style={{ fontSize: '20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontSize: '20px' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
