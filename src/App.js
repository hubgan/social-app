import { BrowserRouter, Route, Routes } from 'react-router-dom';

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

// hooks
import useAuthContext from './hooks/useAuthContext';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  const { authIsReady } = useAuthContext();

  return (
    <BrowserRouter>
      {authIsReady && (
        <Routes>
          <Route path='/' element={<PrivateRoute Component={Home} />} />
          <Route path='/profile' element={<PrivateRoute Component={ProfilePage} />}>
            <Route path='posts' element={<PrivateRoute Component={Posts} />} />
            <Route path='about' element={<PrivateRoute Component={About} />} />
            <Route path='friends' element={<PrivateRoute Component={Friends} />} />
            <Route path='photos' element={<PrivateRoute Component={Photos} />} />
          </Route>
          <Route path='/saved' element={<PrivateRoute Component={Saved} />} />
          <Route path='/notifications' element={<PrivateRoute Component={Notifications} />} />
          <Route path='/signup' element={<PrivateRoute Component={Signup} RedirectURL={'/'} isUserLoggedIn={false} />} />
          <Route path='/login' element={<PrivateRoute Component={Login} RedirectURL={'/'} isUserLoggedIn={false} />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
