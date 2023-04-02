import React from 'react'
import { useOutletContext } from 'react-router-dom';

// components
import PostCard from '../../components/PostCard'
import LoadingSpinner from '../../components/LoadingSpinner'

// hooks
export default function Posts() {
    const { posts, postsLoading } = useOutletContext();

    if (postsLoading) {
        return (
            <div className='flex items-center justify-center mt-10'>
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <>
            {posts && posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </>
    );
}
