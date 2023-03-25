import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'
import useAuthContext from './useAuthContext'
import { useEffect, useState } from 'react';

export default function useLogout() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCancelled, setIsCancelled] = useState(false);
    const { dispatch } = useAuthContext();

    const logout = async () => {
        setError(null);
        setIsLoading(true);

        try {
            await signOut(auth);
            dispatch({ type: 'LOGOUT' });

            if (!isCancelled) {
                setIsLoading(false);
                setError(null);
            }
        } catch (err) {
            if (!isCancelled) {
                setIsLoading(false);
                setError(err.message);
                console.log(err.message);
            }
        }
    }

    useEffect(() => {
        setIsCancelled(false);

        return () => setIsCancelled(true);
    }, [])

    return { logout, error, isLoading };
}
