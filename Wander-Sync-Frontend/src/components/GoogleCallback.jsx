import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
// import apiClient from '../../services/apiClient';
const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // 1. Save Token
      localStorage.setItem('token', token);

      // 2. (Optional) Fetch user data immediately to update Context/State
    //   apiClient.getMe().then(user => setUser(user));

      // 3. Redirect to Dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // If something failed
      navigate('/login?error=no_token');
    }
  }, [navigate, searchParams]);

  return (
    <div style={styles.container}>
      <h2>Logging you in...</h2>
      <p>Please wait while we verify your Google credentials.</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '1.2rem',
  }
};

export default GoogleCallback;