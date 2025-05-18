import { BrowserRouter } from 'react-router';
import { AppRouter } from '../src/routes/AppRouter';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full font-rubik" style={{ 
        background: 'linear-gradient(to bottom right, #25022A, #320425)'
      }}>
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;