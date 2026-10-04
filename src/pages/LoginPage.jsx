import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const inputClass =
  'mb-3 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] outline-none placeholder:text-muted focus:border-accent';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-line bg-white p-8">
        <div className="mb-6">
          <Logo />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Log in</h1>
        <p className="mt-1 mb-6 text-[13.5px] text-ink-soft">Welcome back to ModelFlux.</p>

        {error && <p className="mb-4 rounded-lg bg-down/10 px-3 py-2 text-[13px] text-down">{error}</p>}

        <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />

        <button type="submit" className="mt-2 w-full rounded-xl bg-accent py-2.5 text-[14px] font-semibold text-white hover:opacity-90">
          Log in
        </button>

        <p className="mt-5 text-center text-[13px] text-ink-soft">
          No account? <Link to="/register" className="font-semibold text-accent">Register</Link>
        </p>
      </form>
    </div>
  );
}