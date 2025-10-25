import React, { useState } from 'react';

export default function Login({ error }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in as ${loginId}`);
    // replace alert with your login logic/fetch here
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
        }
        .logo-image {
          margin-bottom: 10px;
        }
        h2 {
          margin-bottom: 24px;
          color: #a0cc3a;
          font-family: 'Nunito', 'Poppins', sans-serif;
        }
        .font-greeno {
          color: #a0cc3a;
          font-family: 'Nunito', 'Poppins', sans-serif;
          margin-top: 0;
        }
        .font-white {
          color: white;
          font-family: 'Nunito', 'Poppins', sans-serif;
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
          margin-top: 12px;
          font-size: 14px;
        }
      `}</style>

      <div className="container">
        <div className="logo-container">
          <img
            src="/assets/greeno.jpg"
            alt="Greeno Logo"
            className="logo-image"
            width="120"
            height="80"
          />
          <h2 className="font-greeno">Greeno Social</h2>
        </div>

        {error && <p className="error">{error}</p>}

        <form className="login" onSubmit={handleSubmit}>
          <input
            name="loginId"
            placeholder="Login"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={{ color: 'black', textDecoration: 'none' }}>
            Login
          </button>
        </form>

        <p className="font-white">
          Don&apos;t have account?{' '}
          <a href="/register" style={{ textDecoration: 'none', color: '#007bff' }}>
            Register
          </a>
        </p>
      </div>
    </>
  );
}
