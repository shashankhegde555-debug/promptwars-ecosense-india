import { useAuth } from '../hooks/useAuth.js';

export default function AuthButton() {
  const { user, signIn, signOut, loading } = useAuth();

  const handleSignIn = async () => {
    try { await signIn(); } catch { /* popup dismissed */ }
  };

  if (loading) return null;

  if (user) {
    return (
      <div className="auth-user" role="group" aria-label="User account">
        {user.photoURL && (
          <img src={user.photoURL} alt={user.displayName || 'User avatar'} className="auth-avatar" />
        )}
        <span className="auth-name">{user.displayName?.split(' ')[0]}</span>
        <button className="btn btn-outline btn-sm" onClick={signOut} aria-label="Sign out">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button className="btn btn-primary" onClick={handleSignIn} aria-label="Sign in with Google">
      <span aria-hidden="true">🔐</span> Sign in with Google
    </button>
  );
}
