import React from 'react'
import { Link } from 'react-router-dom';

// components
import Avatar from './Avatar'

export default function FriendInfo({ friend }) {
    return (
        <div className='flex gap-2 items-center'>
            <Avatar src={friend.avatar} />
            <Link to={`/profile/${friend.id}/posts`} className='font-bold text-xl hover:underline'>{friend.name}</Link>
        </div>
    );
}
