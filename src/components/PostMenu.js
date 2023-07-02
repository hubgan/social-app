import React from 'react';
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

	const handleDelete = () => {
		if (user.uid !== createdBy) return;

		setIsComponentVisible(false);
		deleteDocument(postId);
	};

	return (
		<>
			{!isComponentVisible && (
				<button
					onClick={() => setIsComponentVisible(true)}
					className='text-gray-400'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
						/>
					</svg>
				</button>
			)}
			{isComponentVisible && (
				<button
					onClick={() => setIsComponentVisible(false)}
					className='text-gray-400'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
						/>
					</svg>
				</button>
			)}
			<div ref={refProp} className='relative'>
				{isComponentVisible && (
					<div
						className='absolute -right-6 bg-white shadow-md shadow-gray-300 p-3
                             rounded-sm border-gray-100 w-52 z-10'
					>
						{user.uid === createdBy && (
							<a
								href='#'
								className='flex gap-3 py-2 my-2 -mx-4 px-4 rounded-md hover:bg-socialBlue transition-all hover:scale-110 hover:shadow-md hover:text-white shadow-gray-300'
								onClick={handleDelete}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth={1.5}
									stroke='currentColor'
									className='w-6 h-6'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
									/>
								</svg>
								Delete post
							</a>
						)}
						{user.uid !== createdBy && (
							<a
								href='#'
								className='flex gap-3 py-2 my-2 -mx-4 px-4 rounded-md hover:bg-socialBlue transition-all hover:scale-110 hover:shadow-md hover:text-white shadow-gray-300'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth={1.5}
									stroke='currentColor'
									className='w-6 h-6'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
									/>
								</svg>
								Report
							</a>
						)}
					</div>
				)}
			</div>
		</>
	);
}
