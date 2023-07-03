import React, { useState } from 'react';

// Components
import Portal from './Portal';
import ToastNotification from './ToastNotification';
import SettingsIcon from './icons/SettingsIcon';
import TrashIcon from './icons/TrashIcon';
import WarningIcon from './icons/WarningIcon';

// Hooks
import useAuthContext from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore';

export default function PostMenu({
	refProp,
	isComponentVisible,
	setIsComponentVisible,
	createdBy,
	postId,
}) {
	const { user } = useAuthContext();
	const { deleteDocument } = useFirestore('posts');
	const { addDocument } = useFirestore('reports');
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDelete = () => {
		if (user.uid !== createdBy) return;

		setIsComponentVisible(false);
		deleteDocument(postId);
	};

	const handleReport = () => {
		if (user.uid === createdBy) return;

		setIsModalOpen(true);
		setIsComponentVisible(false);

		const reportData = {
			postId: postId,
			reportedBy: user.uid,
		};

		addDocument(reportData);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			{!isComponentVisible && (
				<button
					onClick={() => setIsComponentVisible(true)}
					className='text-gray-400'
				>
					<SettingsIcon />
				</button>
			)}
			{isComponentVisible && (
				<button
					onClick={() => setIsComponentVisible(false)}
					className='text-gray-400'
				>
					<SettingsIcon />
				</button>
			)}
			<div ref={refProp} className='relative'>
				{isComponentVisible && (
					<div
						className='absolute -right-6 bg-white shadow-md shadow-gray-300 p-3
                             rounded-sm border-gray-100 w-52 z-10'
					>
						{user.uid === createdBy && (
							<p
								className='flex gap-3 py-2 my-2 -mx-4 px-4 rounded-md hover:bg-socialBlue transition-all hover:scale-110 hover:shadow-md hover:text-white shadow-gray-300 cursor-pointer'
								onClick={handleDelete}
							>
								<TrashIcon />
								Delete post
							</p>
						)}
						{user.uid !== createdBy && (
							<p
								className='flex gap-3 py-2 my-2 -mx-4 px-4 rounded-md hover:bg-socialBlue transition-all hover:scale-110 hover:shadow-md hover:text-white shadow-gray-300 cursor-pointer'
								onClick={handleReport}
							>
								<WarningIcon />
								Report
							</p>
						)}
					</div>
				)}
			</div>
			<Portal
				Component={ToastNotification}
				data={{
					message: 'Report has been sent successfully',
					Icon: WarningIcon,
				}}
				isOpen={isModalOpen}
				close={closeModal}
			/>
		</>
	);
}
