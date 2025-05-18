import { useAuth } from "../contexts/AuthContext"

export default function FeedPage() {
    const user = useAuth();
    console.log(user);
    return (
        <div>
            <div>Profile Id:</div>
        </div>
    )
}