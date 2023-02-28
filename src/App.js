import { Route, Routes } from 'react-router-dom';

// styles
import './App.css';

// pages
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  )
}
