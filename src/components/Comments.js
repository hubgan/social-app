import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState, memo } from 'react';

import Comment from './Comment';
import LoadingSpinner from './LoadingSpinner';

function Comments({ referenceArray }) {
	const [vissibleCommentsCount, setVisibleCommentsCount] = useState(0);
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const unsubsribe = useRef(null);

	useEffect(() => {
		const getComments = async () => {
			setIsLoading(true);

			const ref = collection(...referenceArray);
			unsubsribe.current = onSnapshot(
				ref,
				(snapshot) => {
					const data = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));

					setData(data);
					setError(null);
					setIsLoading(false);
				},
				(error) => {
					console.log(error);
					setError(error.message);
					setIsLoading(false);
				},
			);
		};

		getComments();

		return () => {
			if (!unsubsribe) {
				return unsubsribe();
			}
		};
	}, [referenceArray]);

	const showMoreComments = () => {
		setVisibleCommentsCount((prevCommentsCount) => prevCommentsCount + 3);
	};

	const comments = data.length > 0 ? data.slice(0, vissibleCommentsCount) : [];

	if (isLoading) {
		return (
			<div>
				<div className='flex items-center justify-center'>
					<LoadingSpinner />
				</div>
			</div>
		);
	}

	if (error) {
		return <div>Something goes wrong</div>;
	}

	return (
		<>
			{comments.length > 0 &&
				comments.map((comment) => (
					// referenceArray contains [refToDB, postCollectionName, postID, commentsCollectionName, commentID, repliesCollectionName, and so on...]

					<Comment
						key={comment.id}
						comment={comment}
						referenceArray={referenceArray}
					/>
				))}
			{data.length > vissibleCommentsCount && (
				<div className='flex items-center justify-center mt-3'>
					<span
						onClick={showMoreComments}
						className='text-socialBlue cursor-pointer text-sm'
					>
						Load more comments
					</span>
				</div>
			)}
		</>
	);
}

const areEqual = (prevProps, nextProps) => {
	// There is no need to compare all items because the previous ones stay the same, only the number can be increased by adding new ones
	return prevProps.length === nextProps.length;
};

export default memo(Comments, areEqual);
