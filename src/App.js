import { Route, Routes } from 'react-router-dom';

// styles
import './App.css';

// pages
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import Posts from './pages/profile/Posts'
import About from './pages/profile/About'
import Friends from './pages/profile/Friends'
import Photos from './pages/profile/Photos'
import Saved from './pages/Saved';
import Notifications from './pages/Notifications';
import Signup from './pages/Signup';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/profile' element={<ProfilePage />}>
        <Route path='posts' element={<Posts />} />
        <Route path='about' element={<About />} />
        <Route path='friends' element={<Friends />} />
        <Route path='photos' element={<Photos />} />
      </Route>
      <Route path='/saved' element={<Saved />} />
      <Route path='/notifications' element={<Notifications />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}
