import { Outlet } from 'react-router-dom';
import BottomNav from '../BottomNav/BottomNav';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default App;
