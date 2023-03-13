import React from 'react'

// components
import Avatar from './Avatar'

export default function FriendInfo() {
    return (
        <div className='flex gap-2'>
            <Avatar />
            <div>
                <h3 className='font-bold text-xl'>John Doe</h3>
                <p className='text-sm leading-3'>5 mutual friends</p>
            </div>
        </div>
    );
}
