import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './hooks/useSiteConfig';
import { ThemeEngineProvider } from './hooks/useThemeEngine';
import ThemeTransitionLayer from './components/theme/ThemeTransitionLayer';
import HomePage from './pages/HomePage';
import ControlRoomPage from './pages/ControlRoomPage';

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <ThemeEngineProvider>
          <ThemeTransitionLayer />
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
