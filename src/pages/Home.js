import React from 'react'
import NavigationCard from '../components/NavigationCard';
import PostCard from '../components/PostCard';
import PostFormCard from '../components/PostFormCard';

export default function Home() {
    return (
        <div className='flex gap-6 mt-4 max-w-4xl mx-auto'>
            <div className='w-1/4'>
                <NavigationCard />
            </div>
            <div className='w-3/4'>
                <PostFormCard />
                <PostCard />
            </div>
        </div>
    );
}
