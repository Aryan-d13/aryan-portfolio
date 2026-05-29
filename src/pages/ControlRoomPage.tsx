import { useState, useCallback, useEffect } from 'react';
import AdminGate from '../components/admin/AdminGate';
import ControlRoom from '../components/admin/ControlRoom';
import { useSiteConfig } from '../hooks/useSiteConfig';
import '../styles/control-room.css';

export default function ControlRoomPage() {
  const { config } = useSiteConfig();
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('cr_authenticated') === '1'
  );

  useEffect(() => {
    document.body.classList.add('cr-active');
    document.documentElement.classList.add('cr-active');
    return () => {
      document.body.classList.remove('cr-active');
      document.documentElement.classList.remove('cr-active');
    };
  }, []);

  const handleAuthenticated = useCallback(() => {
    setAuthenticated(true);
  }, []);

  if (!authenticated) {
    return <AdminGate onAuthenticated={handleAuthenticated} />;
  }

  return <ControlRoom initialConfig={config} />;
}
