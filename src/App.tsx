import './App.css'
import UserList from './components/UserList';

const App: React.FC = () => {
  return (
    <div>
      <h1 className="page-title">Cinemate: admin panel</h1>
      <UserList />
    </div>
  );
};

export default App;
