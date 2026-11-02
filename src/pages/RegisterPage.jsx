import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        course: university,
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed. Please check your details.');
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
          {/* Steps preview */}
          <div className="flex flex-col gap-3">
            {[
              { step: '01', label: 'Create your account', accent: 'bg-[#FFD84D]' },
              { step: '02', label: 'Set up your workspace', accent: 'bg-[#A8E6CF]' },
              { step: '03', label: 'Invite your team', accent: 'bg-[#B8C5FF]' },
              { step: '04', label: 'Start shipping tasks', accent: 'bg-[#FF9B85]' },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <span className={`${s.accent} border-2 border-[#333] text-[#171717] text-[10px] font-extrabold px-2 py-1 uppercase tracking-widest`}>
                  {s.step}
                </span>
                <span className="text-[#CCC] text-xs font-bold">{s.label}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-white font-black text-2xl leading-tight">
              Join the team.<br />Start building.
            </p>
            <p className="text-[#AAA] text-sm font-semibold mt-2">
              Create an account to collaborate on team milestones.
            </p>
          </div>
        </div>

        <p className="text-[#555] text-xs font-bold uppercase tracking-widest">
          KanbanBoard Workspace
        </p>
      </div>

      {/* Right: Register Form */}
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
              Registration
            </span>
            <h1 className="text-3xl font-black text-[#171717] tracking-tight mt-1">
              Join the team
            </h1>
            <p className="text-sm text-[#555555] font-semibold mt-1">
              Create an account to collaborate on team milestones.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 bg-[#FF7777]/10 border-2 border-[#FF7777] text-[#171717] text-xs font-bold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="Gourish"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Course / Team"
              type="text"
              required
              placeholder="MERN Stack Lab"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="gourish@university.edu"
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-xs font-bold text-[#555555] mt-7 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#171717] underline underline-offset-2">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
