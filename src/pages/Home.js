import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

// components
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import PostFormCard from '../components/PostFormCard';
import LoadingSpinner from '../components/LoadingSpinner';

// hooks
import useAuthContext from '../hooks/useAuthContext';

export default function Home() {
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function getUserData() {
            setIsLoading(true);

            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);
            const friends = [...userSnapshot.data().friends, user.uid];

            const postsQuery = query(collection(db, 'posts'), where('createdBy', 'in', friends));
            const postsSnapshot = await getDocs(postsQuery);
            const postsData = postsSnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            });

            setPosts(postsData);
            setIsLoading(false);
        }

        getUserData();
    }, [user.uid]);

    if (isLoading) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <LoadingSpinner />
            </div>
        );
    };

    return (
        <Layout>
            <PostFormCard />
            {posts && posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </Layout>
    );
}
