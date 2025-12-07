/**
 * Hook to check if current browser is an admin
 * Uses localStorage to remember admin status
 */

export function useAdminCheck() {
  const ADMIN_EMAILS = ['lamnguyen.hcmut@gmail.com'];
  
  const isAdminEmail = (email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  const checkIsAdmin = (): boolean => {
    const savedEmail = localStorage.getItem('spotify_demo_email');
    if (savedEmail && isAdminEmail(savedEmail)) {
      return true;
    }
    return false;
  };

  return { isAdminEmail, checkIsAdmin };
}

