import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from '../firebase/config'

export function useCollection(collectionName, _query, _orderBy) {
    const [documents, setDocuments] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const __query = useRef(_query).current;
    const __orderBy = useRef(_orderBy).current;

    useEffect(() => {
        setIsLoading(true);

        let collectionRef = collection(db, collectionName);

        if (__query) {
            collectionRef = query(collectionRef, where(...__query));
        }

        if (__orderBy) {
            collectionRef = query(collectionRef, orderBy(...__orderBy));
        }

        const unsub = onSnapshot(collectionRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setDocuments(data);
            setError(null);
            setIsLoading(false);
        }, (error) => {
            console.log(error);
            setError('Could not fetch data');
            setIsLoading(false);
        });

        return () => unsub();
    }, [collectionName, __query, __orderBy])

    return { documents, error, isLoading };
}
