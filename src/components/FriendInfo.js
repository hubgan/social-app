import React from 'react'

// components
import Avatar from './Avatar'

export default function FriendInfo({ friend }) {
    return (
        <div className='flex gap-2 items-center'>
            <Avatar src={friend.avatar} />
            <h3 className='font-bold text-xl'>{friend.name}</h3>
        </div>
    );
}
