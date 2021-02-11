import './App.css';

import React, { useState } from 'react';
import SignIn from './SignIn';
import Search from './Search';

function App() {
  const [u, setUsername] = useState('');
  const [p, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (username && password) return <Search />;

  return showLogin
    ? <SignIn
      username={u}
      password={p}
      setShowLogin={setShowLogin}
      setUsername={setUsername}
      setPassword={setPassword}
    />
    : <Search />;
}

export default App;
