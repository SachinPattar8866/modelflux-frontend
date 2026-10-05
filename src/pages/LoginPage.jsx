import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import AnimatedMascots from '../components/auth/AnimatedMascots'; 

const inputClass =
  'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] outline-none placeholder:text-muted focus:border-accent cursor-text select-text text-ink';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setSuccess(true);
      setTimeout(() => navigate('/chat'), 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  const clearError = () => error && setError('');

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-canvas cursor-default select-none">
      <div className="hidden lg:flex w-1/2 bg-[#EAEBEF] dark:bg-black/20 flex-col items-center justify-center relative overflow-hidden">
        <AnimatedMascots 
          focused={isFocused} 
          passwordVisible={showPassword} 
          submitHover={submitHover} 
          error={!!error} 
          success={success} 
        />
      </div>

      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[360px]">
          <div className="mb-10 flex justify-center lg:justify-start">
            <Logo />
          </div>
          
          <h1 className="text-[28px] font-extrabold tracking-tight text-ink mb-2">Welcome back!</h1>
          <p className="mb-8 text-[14px] text-ink-soft">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit}>
            {error && <p className="mb-4 rounded-lg bg-down/10 px-3 py-2 text-[13px] text-down">{error}</p>}

            <label className="mb-1.5 block text-[13px] font-semibold text-ink">Email</label>
            <input 
              type="email" 
              placeholder="you@company.com" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); clearError(); }} 
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`${inputClass} mb-3`} 
              required 
            />
            
            <label className="mb-1.5 block text-[13px] font-semibold text-ink mt-3">Password</label>
            <div className="relative mb-3">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••(min 8 chars)" 
                value={password} 
                onChange={(e) => { setPassword(e.target.value); clearError(); }} 
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                // Added pr-10 for text spacing, and hidden the browser's default eye icon
                className={`${inputClass} pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden`} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading || success}
              onMouseEnter={() => setSubmitHover(true)}
              onMouseLeave={() => setSubmitHover(false)}
              className="mt-4 w-full rounded-full bg-ink py-3 text-[14px] font-semibold text-canvas hover:opacity-90 cursor-pointer transition-opacity disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-8 text-center text-[13.5px] text-ink-soft">
            Don't have an account? <Link to="/register" className="font-semibold text-ink hover:underline cursor-pointer ml-1">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}