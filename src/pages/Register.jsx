import { useState } from 'react';
import { useAuth } from '../AuthContext';

function Register({ onLogin, onBackHome }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await register({ name, email, password });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg relative">
        {onBackHome && (
          <button
            onClick={onBackHome}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
          >
            &larr; Back to Home
          </button>
        )}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">AgileFlow</h1>
          <p className="mt-2 text-slate-500">Create your collaborative workspace account</p>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Create account</h2>

        <form className="mt-6" onSubmit={handleRegister}>
          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="register-name">Full name</label>
          <input id="register-name" value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" placeholder="Your name" className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="register-email">Email</label>
          <input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="you@example.com" className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="register-password">Password</label>
          <input id="register-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="6" autoComplete="new-password" placeholder="At least 6 characters" className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="register-confirm-password">Confirm password</label>
          <input id="register-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength="6" autoComplete="new-password" placeholder="Repeat your password" className="mb-6 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <button onClick={onLogin} className="font-medium text-blue-600 hover:underline">Sign in</button></p>
      </section>
    </main>
  );
}

export default Register;
