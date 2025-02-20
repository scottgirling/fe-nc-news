import { Link } from 'react-router-dom';
import '../Header.css';
import { useContext } from 'react';
import { UserAccount } from '../contexts/UserAccount';

export const Header = () => {
    const { loggedInUser } = useContext(UserAccount);
    return (
        <>
            <header>
                <Link to="/">
                    <h1 className="title">Northcoders News</h1>
                </Link>
                <Link className="user-login" to="/login">
                    <button className="user-login-button"><i className="fa-solid fa-user"></i></button>
                </Link>
            </header>
            {loggedInUser ? <p className="logged-in-user">{loggedInUser.username}</p>
                : null
            }
        </>

    );
}