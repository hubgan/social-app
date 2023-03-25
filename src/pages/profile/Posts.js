import React from 'react'
import { useParams } from 'react-router-dom';

// components
import PostCard from '../../components/PostCard'

// hooks
import { useCollection } from '../../hooks/useCollection'

export default function Posts() {
    const { id } = useParams();
    const { documents } = useCollection('posts', ['createdBy', '==', id]);

    return (
        <>
            {documents && documents.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </>
    );
}
