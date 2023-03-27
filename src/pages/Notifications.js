import React from 'react'

// components
import Layout from '../components/Layout'
import Card from '../components/Card';
import useAuthContext from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import SingleNotification from '../components/SingleNotification';

export default function Notifications() {
    const { user } = useAuthContext();
    const { documents } = useCollection('notifications', ['sendTo', '==', user.uid]);

    return (
        <Layout>
            <h1 className='text-6xl mb-4 text-gray-400'>Notifications</h1>
            <Card noPadding={true}>
                {documents && documents.map((notification) => (
                    <SingleNotification key={notification.id} notification={notification} />
                ))}
            </Card>
        </Layout>
    );
}
