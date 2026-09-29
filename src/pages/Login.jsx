import { useState } from 'react';
import { useAuth } from '../AuthContext';

function Login({ onRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">AgileFlow</h1>
          <p className="mt-2 text-slate-500">Your collaborative project workspace</p>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Welcome back</h2>
        <p className="mt-1 text-slate-500">Sign in to continue to your boards.</p>

        <form className="mt-6" onSubmit={handleLogin}>
          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="login-email">Email</label>
          <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="you@example.com" className="mb-5 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="login-password">Password</label>
          <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder="Your password" className="mb-6 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">New to AgileFlow? <button onClick={onRegister} className="font-medium text-blue-600 hover:underline">Create an account</button></p>
      </section>
    </main>
  );
}

export default Login;
