'use client';

export function LogoutButton({ className }: { className?: string }) {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.assign('/');
  }

  return (
    <button type="button" onClick={handleLogout} className={className ?? 'secondary-button'}>
      Cerrar sesión
    </button>
  );
}
