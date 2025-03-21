import { Link } from 'react-router-dom';
import '../Header.css';
import { useContext } from 'react';
import { UserAccount } from '../contexts/UserAccount';
import { Avatar } from '@mui/material';

export const Header = () => {
    const { loggedInUser } = useContext(UserAccount);

    return (
        <header>
            <Link to="/">
                <h1 className="title">Northcoders News</h1>
            </Link>
            <Link className="user-login" to="/login">
                {loggedInUser ? (
                    <Avatar
                        sx={{ height: "4rem", width: "4rem" }}
                        alt="User profile picture" 
                        src={loggedInUser.avatar_url} 
                    />
                ) : (
                    <Avatar sx={{ background: "#9db4c0", border: "1px solid #213547", color: "#213547" }} src="/broken-image.jpg" />
                )}
            </Link>
        </header>
    );
}