import React from 'react';
import useAuthContext from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';

// components
import Layout from '../components/Layout';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import SingleNotification from '../components/SingleNotification';

export default function Notifications() {
	const { user } = useAuthContext();
	const { documents, isLoading } = useCollection('notifications', [
		{ property: 'sendTo', operator: '==', value: user.uid },
	]);

	return (
		<Layout>
			<h1 className='text-6xl mb-4 text-gray-400'>Notifications</h1>
			<Card noPadding={true}>
				{documents &&
					documents.map((notification) => (
						<SingleNotification
							key={notification.id}
							notification={notification}
						/>
					))}
				{isLoading && (
					<div className='h-screen flex items-center justify-center'>
						<LoadingSpinner />
					</div>
				)}
			</Card>
		</Layout>
	);
}
