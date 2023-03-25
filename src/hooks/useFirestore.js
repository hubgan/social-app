import { useReducer, useEffect, useState } from 'react';
import { collection, setDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
};

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case 'IS_PENDING':
            return { document: null, isPending: true, error: null, success: null };
        case 'ADDED_DOCUMENT':
            return { document: action.payload, isPending: false, error: null, success: true };
        case 'UPDATED_DOCUMENT':
            return { document: action.payload, isPending: false, error: null, success: true };
        case 'DELETED_DOCUMENT':
            return { document: null, isPending: false, error: null, success: true };
        case 'ERROR':
            return { document: null, isPending: false, error: action.payload, success: false };
        default:
            return { ...state };
    }
}

export function useFirestore(collectionName) {
    const [response, dispatch] = useReducer(firestoreReducer, initialState);
    const [isCancelled, setIsCancelled] = useState(false);

    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    }

    const addDocument = async (data) => {
        dispatch({ type: 'IS_PENDING' });

        try {
            const ref = doc(collection(db, collectionName));
            const createdAt = serverTimestamp();
            const addedDocument = await setDoc(ref, { ...data, createdAt });
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument });
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        }
    }

    const updateDocument = async (id, updates) => {
        dispatch({ type: 'IS_PENDING' });

        try {
            const ref = doc(db, collectionName, id);
            const updatedDocument = await updateDoc(ref, updates);
            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument });
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        }
    }

    const deleteDocument = async (id) => {
        dispatch({ type: 'IS_PENDING' });

        try {
            const ref = doc(db, collectionName, id);
            await deleteDoc(ref);
            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' });
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        }
    }

    useEffect(() => {
        setIsCancelled(false);

        return () => setIsCancelled(true);
    }, []);

    return { addDocument, updateDocument, deleteDocument, response };
}
