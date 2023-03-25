import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/config';
import useAuthContext from '../hooks/useAuthContext';

export default function useLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCancelled, setIsCancelled] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setError(null);
        setIsLoading(true);

        try {
            const res = await signInWithEmailAndPassword(auth, email, password);

            dispatch({ type: 'LOGIN', payload: res.user });

            if (!isCancelled) {
                setIsLoading(false);
                setError(null);
            }
        } catch (err) {
            if (!isCancelled) {
                setError(err.message);
                setIsLoading(false);
                console.log(err.message);
            }
        }
    }

    useEffect(() => {
        setIsCancelled(false);

        return () => setIsCancelled(true);
    }, [])

    return { login, error, isLoading };
}
