import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('demo@gmail.com');
  const [password, setPassword] = useState('123456');
  const { setUser } = useUser();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

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
  setLoading(true);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) throw new Error('User profile not found in Firestore');

    const userData = snap.data();

    // Check whether the field actually exists in Firestore
    const hasLoginDevicesField = Object.prototype.hasOwnProperty.call(userData, 'loginDevices');

    if (hasLoginDevicesField) {
      // Treat 1/true as "already logged in"
      const isAlreadyLoggedIn =
        userData.loginDevices === 1 || userData.loginDevices === true;

      if (isAlreadyLoggedIn) {
        alert('User already logged in on another device.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      await updateDoc(userDocRef, { loginDevices: 1 });
    }
    const finalUser = hasLoginDevicesField
      ? { uid, ...userData, loginDevices: 1 }
      : { uid, ...userData };

    setUser(finalUser);
    localStorage.setItem('user', JSON.stringify(finalUser));

    navigate('/');
  } catch (err: any) {
    setError(err?.message || 'Login failed');
  } finally {
    setLoading(false);
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
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <Link to="/signup" className="text-blue-500 underline">
        Create your account
      </Link>
    </div>
  );
};

export default Login;
