import React, { useState } from 'react';

export default function Login({ error }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    //alert(`Logging in as ${loginId}`);
    // replace alert with your login logic/fetch here
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
        text-align: center;
      }
      /* (keep the rest of your styles) */
    `}</style>

    <div className="wrapper">
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
    </div>
  </>
);

}
