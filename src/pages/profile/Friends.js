import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

// components
import Card from '../../components/Card'
import FriendInfo from '../../components/FriendInfo';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Friends() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [document] = useOutletContext();

    useEffect(() => {
        async function getFriends() {
            setIsLoading(true);

            const friendsQuery = query(collection(db, 'users'), where('id', 'in', document.friends));
            const friendsSnapshot = await getDocs(friendsQuery);
            const friendsData = friendsSnapshot.docs.map((doc) => doc.data());

            setFriends(friendsData);
            setIsLoading(false);
        }

        if (document && document.friends.length > 0) {
            getFriends();
        }
    }, [id, document]);

    if (isLoading) {
        return (
            <div>
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <Card>
            <h2 className='text-3xl mb-2'>Friends</h2>
            <div className='grid gap-6 grid-cols-2'>
                {friends.length > 0 && friends.map((friend) => (
                    <FriendInfo key={friend.id} friend={friend} />
                ))}
            </div>
        </Card>
    );
}
