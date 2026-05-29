import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './hooks/useSiteConfig';
import { ThemeEngineProvider } from './hooks/useThemeEngine';
import HomePage from './pages/HomePage';
import ControlRoomPage from './pages/ControlRoomPage';

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <ThemeEngineProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/control-room" element={<ControlRoomPage />} />
            <Route path="/admin" element={<ControlRoomPage />} />
          </Routes>
        </ThemeEngineProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}
