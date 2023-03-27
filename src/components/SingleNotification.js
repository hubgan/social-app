import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';

export default function SingleNotification({ notification }) {
    const [isLoading, setIsLoading] = useState(false);
    const { document: senderInfo } = useDocument('users', notification.sendBy);
    const { document: reciverInfo } = useDocument('users', notification.sendTo);

    const { updateDocument } = useFirestore('users');
    const { addDocument, deleteDocument } = useFirestore('notifications');

    const handleAcceptRequest = () => {
        if (isLoading) return;

        setIsLoading(true);

        Promise.allSettled([
            updateDocument(notification.sendBy, { friends: [...senderInfo.friends, notification.sendTo] }),
            updateDocument(notification.sendTo, { friends: [...reciverInfo.friends, notification.sendBy] }),
            addDocument({ type: 'ACCEPT_REQUEST', sendBy: notification.sendTo, sendTo: notification.sendBy, senderName: reciverInfo.name }),
            deleteDocument(notification.id)
        ]).then(() => {
            setIsLoading(false);
            console.log('Successfuly handle accept request');
        }).catch((error) => {
            console.log(error);
            setIsLoading(false);
        })
    };

    const handleDeclineRequest = async () => {
        if (isLoading) return;

        setIsLoading(true);
        await deleteDocument(notification.id);
        setIsLoading(false);
    }

    if (notification.type === 'FRIEND_REQUEST' && senderInfo && reciverInfo) {
        return (
            <div className='flex gap-3 items-center border-b border-b-gray-100 p-4'>
                <Link to={`/profile/${notification.sendBy}/posts`} className='font-semibold hover:underline'>{notification.senderName}</Link>
                <span> wants to be your friend</span>
                <span onClick={handleAcceptRequest} className='text-lime-500 ml-auto mr-1 cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </span>
                <span onClick={handleDeclineRequest} className='text-red-600 cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </span>
            </div>
        );
    };

    if (notification.type === 'ACCEPT_REQUEST' && senderInfo && reciverInfo) {
        return (
            <div className='flex gap-3 items-center border-b border-b-gray-100 p-4'>
                <Link to={`/profile/${notification.sendBy}/posts`} className='font-semibold hover:underline'>{notification.senderName}</Link>
                <span> accepts your friend request!</span>
            </div>
        );
    }
}
