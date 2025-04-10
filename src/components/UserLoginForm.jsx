import { useContext, useState, useEffect } from "react";
import { UserAccount } from "../contexts/UserAccount";
import { fetchUsers } from "../utils/api";
import { UserCard } from "./UserCard";
import '../UserLoginForm.css';

export const UserLoginForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const { loggedInUser, setLoggedInUser } = useContext(UserAccount);

    useEffect(() => {
        fetchUsers()
        .then((returnedUsers) => {
            setUsers(returnedUsers)
        })
    }, []);

    const handleChange = (event) => {
        const foundUser = users.find((user) => {
            return user.username === event.target.value;
        })
        setSelectedUser(foundUser)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoggedInUser(selectedUser);
    }

    return (
        <>
            {loggedInUser ? (
                <>
                    <h2>Hello {loggedInUser.username}</h2>
                    <UserCard loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
                </>
            ) : (
                <form className="user-login-form" onSubmit={(event) => handleSubmit(event)}>
                    <label htmlFor="users">
                        Login to your account: </label>
                    <select
                        onChange={(event) => handleChange(event)}
                        name="users"
                        id="users"
                        defaultValue="none"
                    >
                        <option value="none" disabled hidden>
                            Select your username
                        </option>
                        {users.map((user) => {
                            return (
                                <option
                                    key={user.username}
                                    value={user.username}
                                >
                                    {user.username}
                                </option>
                            )
                        })}
                    </select>
                    <input type="submit"></input>
                </form>
            )}
        </>
    )
}