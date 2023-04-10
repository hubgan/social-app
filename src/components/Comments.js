import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'

import Comment from './Comment';
import LoadingSpinner from './LoadingSpinner';

export default function Comments({ referenceArray }) {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const unsubsribe = useRef(null);

    useEffect(() => {
        const getComments = async () => {
            setIsLoading(true);

            const ref = collection(...referenceArray);
            unsubsribe.current = onSnapshot(ref, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setComments(data);
                setError(null);
                setIsLoading(false);
            }, (error) => {
                console.log(error)
                setError(error.message);
                setIsLoading(false);
            });
        }

        getComments();

        return () => {
            if (!unsubsribe) {
                return unsubsribe();
            }
        }
    }, [])

    if (isLoading) {
        return (
            <div>
                <div className='flex items-center justify-center'>
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    return (
        <>
            {comments.length > 0 && comments.map((comment) => (
                // referenceArray contains [refToDB, postCollectionName, postID, commentsCollectionName, commentID, repliesCollectionName, and so on...]

                <Comment key={comment.id} comment={comment} referenceArray={referenceArray} />
            ))}
        </>
    );
}
