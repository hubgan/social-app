import React from 'react'
import { Link } from 'react-router-dom';

// components
import Layout from '../components/Layout'
import Card from '../components/Card';
import Avatar from '../components/Avatar'

export default function Notifications() {
    return (
        <Layout>
            <h1 className='text-6xl mb-4 text-gray-400'>Notifications</h1>
            <Card noPadding={true}>
                <div className='flex gap-3 items-center border-b border-b-gray-100 p-4'>
                    <Link to={'/profile/posts'}>
                        <Avatar />
                    </Link>
                    <div>
                        <Link to={'/profile/posts'} className='font-semibold hover:underline'>John Doe</Link>
                        <span> liked </span>
                        <Link to={'/profile/photos'} className='text-socialBlue hover:underline'>your photo</Link>
                    </div>
                </div>
                <div className='flex gap-3 items-center border-b border-b-gray-100 p-4'>
                    <Link to={'/profile/posts'}>
                        <Avatar />
                    </Link>
                    <div>
                        <Link to={'/profile/posts'} className='font-semibold hover:underline'>John Doe</Link>
                        <span> liked </span>
                        <Link to={'/profile/photos'} className='text-socialBlue hover:underline'>your photo</Link>
                    </div>
                </div>
                <div className='flex gap-3 items-center border-b border-b-gray-100 p-4'>
                    <Link to={'/profile/posts'}>
                        <Avatar />
                    </Link>
                    <div>
                        <Link to={'/profile/posts'} className='font-semibold hover:underline'>John Doe</Link>
                        <span> liked </span>
                        <Link to={'/profile/photos'} className='text-socialBlue hover:underline'>your photo</Link>
                    </div>
                </div>
            </Card>
        </Layout>
    );
}
