import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('demo@gmail.com');
  const [password, setPassword] = useState('123456');
  const { setUser } = useUser();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        navigate('/');
      } catch (err) {
        console.log('');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'users', uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        throw new Error('User profile not found in Firestore');
      }

      const userData = userSnapshot.data();

      // 🚨 Check loginDevices flag
      if (userData.loginDevices === 1) {
        alert('User already logged in on another device.');
        // Sign out immediately so Firebase Auth session isn't kept
        await auth.signOut();
        return;
      }

      // Store in Context + LocalStorage
      setUser({ uid, ...userData });
      localStorage.setItem('user', JSON.stringify({ uid, ...userData }));

      // Redirect
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen p-4 bg-white rounded shadow space-y-4 flex items-center justify-center flex-col">
      <h2 className="text-xl font-bold text-center">Login</h2>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <Link to="/signup" className="text-blue-500 underline">
        Create your account
      </Link>
    </div>
  );
};

export default Login;
