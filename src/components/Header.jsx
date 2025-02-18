import { Link } from 'react-router-dom';
import '../Header.css';

export const Header = () => {
    return (
        <header>
            <Link to="/">
                <h1 className="title">Northcoders News</h1>
            </Link>
            <button className="user-login"><i className="fa-solid fa-user"></i></button>
        </header>
    );
}