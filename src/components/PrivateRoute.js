import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

//hooks
import useAuthContext from '../hooks/useAuthContext'

export default function PrivateRoute({ Component, RedirectURL = '/login', isUserLoggedIn = true }) {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if ((isUserLoggedIn && !user) || (!isUserLoggedIn && user)) {
            navigate(RedirectURL);
        }
    }, [user, navigate, RedirectURL, isUserLoggedIn]);

    return (
        <>
            {(!(isUserLoggedIn && !user) || (!isUserLoggedIn && user)) && (
                <Component />
            )}
        </>
    );
}
