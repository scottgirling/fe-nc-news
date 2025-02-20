import { createContext, useState } from "react";

export const UserAccount = createContext(null);

export const UserAccountProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    return (
        <UserAccount.Provider value={{ loggedInUser, setLoggedInUser }}>
            {children}
        </UserAccount.Provider>
    );
}