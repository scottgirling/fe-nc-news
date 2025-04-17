import '../UserCard.css';

export const UserCard = ({ loggedInUser, setLoggedInUser }) => {

    const handleSignOut = () => {
        setLoggedInUser(null);
    }

    return (
        <section className="user-card">
            <img src={loggedInUser.avatar_url} alt="User profile picture"/>
            <button onClick={() => handleSignOut()} className="sign-out-button">Sign Out <i className="fa-solid fa-arrow-right-from-bracket"></i></button>
        </section>
    );
}