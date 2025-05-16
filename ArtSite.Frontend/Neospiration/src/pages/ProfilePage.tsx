import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextDefinition';

export default function ProfilePage() {
    const { profileId } = useParams<{ profileId: string }>();
    const { user } = useAuth();
    
    return (
        <div className="profile-page">
        <h1>Profile Page</h1>
        <p>Profile ID: {profileId}</p>
        <p>Username: {user?.userName}</p>
        <p>Email: {user?.email}</p>
        </div>
    );
}