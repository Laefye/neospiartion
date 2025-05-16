import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextDefinition';

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="home-page">
      <header>
        <h1>Art Site</h1>
        <nav>
          <ul style={{ display: 'flex', gap: '20px', listStyle: 'none' }}>
            <li><Link to="/arts">Browse Arts</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to={`/profile/${user?.profileId}`}>My Profile</Link></li>
                <li><button onClick={logout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>
        <section className="hero">
          <h2>Discover Amazing Artists</h2>
          <p>Browse artworks, commission your favorite artists, and support creativity.</p>
          <Link to="/arts" className="cta-button">Explore Artworks</Link>
        </section>
      </main>
    </div>
  );
}