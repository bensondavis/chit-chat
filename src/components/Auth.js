import React, { useState } from 'react';
import axios from 'axios';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const server_url = "http://localhost:5000";

  const handleAuth = async () => {
    const url = isRegister ? `${server_url}/api/auth/register` : `${server_url}/api/auth/login`;
    const data = isRegister ? { username, email, password } : { email, password };
    try {
      const res = await axios.post(url, data);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {isRegister && (
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      )}
      <button onClick={handleAuth}>{isRegister ? 'Register' : 'Login'}</button>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </div>
  );
};

export default Auth;