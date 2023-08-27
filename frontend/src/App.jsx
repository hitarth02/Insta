import { Route, Routes, useNavigate , Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';
import Create from './pages/Create';
import Search from './pages/Search';
import Feed from './pages/Feed';
import Suggestions from './pages/Suggestions';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import { useSelector } from 'react-redux';
import Reels from './pages/Reels';
import Messenger from './pages/Messenger';
import SearchUsers from './components/chat/SearchUsers';

function App() {

  const {token} = useSelector((state)=>state.user);

  return (
    <div className=''>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/verify-email' element={<VerifyEmail/>}/>
        <Route
          exact
          element={token !==null ? <Home/> : <Navigate replace to={'/login'}/>}
        >
          <Route
           path='/' 
            element={<Feed/>}
          />
          <Route path='/upload' element={<Create/>}/>
          {/* <Route path='/reels' element={<Reels/>}/> */}
          <Route path='/search' element={<Search/>}/>
          <Route path='/activity' element={<Suggestions/>}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/profile/:usermail' element={<UserProfile/>}/>
        </Route>
        <Route path='/messenger' element={<Messenger/>}/>
        <Route path='/messenger/search' element={<SearchUsers/>}/>
      </Routes>
    </div>
  );
};

export default App;
