import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({
        email: email.trim(),
        password,
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex font-sans">
      {/* Left: Accent Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#171717] flex-col justify-between p-10 border-r-2 border-[#171717]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FFD84D] border-2 border-[#FFD84D] flex items-center justify-center">
            <span className="font-black text-sm text-[#171717]">KB</span>
          </div>
          <span className="font-black text-lg text-white">KanbanBoard</span>
        </Link>

        <div className="flex flex-col gap-6">
          {/* Mini board illustration */}
          <div className="flex flex-col gap-3">
            {[
              { color: 'bg-[#FFD84D]', label: 'Design UI', priority: 'HIGH' },
              { color: 'bg-[#A8E6CF]', label: 'Write Tests', priority: 'NORMAL' },
              { color: 'bg-[#FF9B85]', label: 'API Integration', priority: 'URGENT' },
            ].map((item, i) => (
              <div key={i} className={`${item.color} border-2 border-[#333] p-3 shadow-[2px_2px_0_#444]`}>
                <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 bg-[#171717] text-white">{item.priority}</span>
                <p className="text-xs font-extrabold text-[#171717] mt-1.5">{item.label}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-white font-black text-2xl leading-tight">
              Your tasks,<br />organized.
            </p>
            <p className="text-[#AAA] text-sm font-semibold mt-2">
              Sign in to access your team workspace and sprint board.
            </p>
          </div>
        </div>

        <p className="text-[#555] text-xs font-bold uppercase tracking-widest">
          KanbanBoard Workspace
        </p>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        {/* Mobile brand */}
        <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-9 h-9 bg-[#FFD84D] border-2 border-[#171717] flex items-center justify-center shadow-[2px_2px_0_#171717]">
            <span className="font-black text-sm text-[#171717]">KB</span>
          </div>
          <span className="font-black text-xl text-[#171717]">KanbanBoard</span>
        </Link>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555]">
              Sign In
            </span>
            <h1 className="text-3xl font-black text-[#171717] tracking-tight mt-1">
              Welcome back
            </h1>
            <p className="text-sm text-[#555555] font-semibold mt-1">
              Access your team workspace and sprint board.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 bg-[#FF7777]/10 border-2 border-[#FF7777] text-[#171717] text-xs font-bold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2 shadow-[4px_4px_0_#171717]"
            >
              {isSubmitting ? 'Signing In...' : 'Enter Workspace'}
            </Button>
          </form>

          <p className="text-xs font-bold text-[#555555] mt-7 text-center">
            New team member?{' '}
            <Link to="/register" className="font-extrabold text-[#171717] underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
