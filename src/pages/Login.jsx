import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Sparkles, ArrowLeft, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const DEMO_CREDENTIALS = {
  email: 'demo@agileflow.dev',
  password: 'password123',
};

function Login({ onRegister, onBackHome }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (requestError) {
      setError(
        requestError.message ||
        'Unable to log in. Please check your credentials or click Quick Demo Sign In.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setError('');
    setDemoLoading(true);
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    try {
      await login(DEMO_CREDENTIALS);
    } catch (requestError) {
      setError(
        requestError.message ||
        'Failed to connect to backend server. Make sure the backend is running on http://localhost:5000'
      );
    } finally {
      setDemoLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-slate-200 selection:bg-indigo-500/30 font-sans flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/15 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-violet-600/15 blur-[130px]" />
      </div>

      <section className="w-full max-w-md rounded-2xl bg-white/[0.04] border border-white/10 p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {onBackHome && (
          <button
            onClick={onBackHome}
            className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
        )}

        <div className="mb-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back to Agile<span className="text-indigo-400">Flow</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to access your boards and workspaces</p>
        </div>

        {/* Quick Demo Sign-in Button */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Demo Account
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-medium text-slate-400 hover:text-indigo-300 transition-colors underline cursor-pointer"
            >
              Autofill form
            </button>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={demoLoading || submitting}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 disabled:opacity-50 cursor-pointer"
          >
            {demoLoading ? (
              <span>Signing in with Demo...</span>
            ) : (
              <>
                <span>⚡ Quick Demo Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-[#101018] px-3 text-xs text-slate-500 uppercase tracking-wider">
            or sign in with email
          </span>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{error}</p>
              {error.toLowerCase().includes('invalid') && (
                <p className="mt-1 text-[11px] text-rose-400/80">
                  Tip: If the backend database restarted, use <strong>Quick Demo Sign In</strong> or click <strong>Create an account</strong> below.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300" htmlFor="login-password">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="Your password"
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || demoLoading}
            className="w-full mt-2 rounded-xl bg-white hover:bg-slate-100 text-[#0a0a0f] py-2.5 font-semibold text-sm transition-all shadow-md shadow-white/5 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Signing in…' : 'Sign in to Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          New to AgileFlow?{' '}
          <button
            type="button"
            onClick={onRegister}
            className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
          >
            Create an account
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;
