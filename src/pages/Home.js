import React from 'react'

// components
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import PostFormCard from '../components/PostFormCard'

// hooks
import { useCollection } from '../hooks/useCollection';
import useAuthContext from '../hooks/useAuthContext';

export default function Home() {
    const { user } = useAuthContext();
    const { documents } = useCollection('posts', ['createdBy', '==', user.uid]);

    return (
        <Layout>
            <PostFormCard />
            {documents && documents.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </Layout>
    );
}
