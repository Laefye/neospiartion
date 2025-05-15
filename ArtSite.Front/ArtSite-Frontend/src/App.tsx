import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App


// import { useEffect, useState } from 'react';
// import type { Art } from './types/art';
// import { ArtManager } from '../src/components/ArtManager';
// import { fetchArts } from './api/artService';
// import { CssBaseline, Container, Typography, CircularProgress, Alert } from '@mui/material';

// export const App = () => {
//   const [arts, setArts] = useState<Art[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await fetchArts();
//         setArts(data);
//       } 
//       catch
//       {
//         setError('Ошибка загрузки данных');
//       } 
//       finally 
//       {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <CssBaseline />
//       <Typography variant="h3" component="h1" gutterBottom>
//         Платформа для художников
//       </Typography>

//       {loading ? (
//         <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
//       ) : error ? (
//         <Alert severity="error">{error}</Alert>
//       ) : (
//         <ArtManager arts={arts} setArts={setArts} />
//       )}
//     </Container>
//   );
// };
