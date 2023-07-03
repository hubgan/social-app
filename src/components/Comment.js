import React, { useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

// Components
import Avatar from './Avatar';
import Comments from './Comments';
import SendIcon from './icons/SendIcon';

// Hooks
import { useComments } from '../hooks/useComments';
import useAuthContext from '../hooks/useAuthContext';

export default function Comment({ comment, referenceArray }) {
	const [replyInputVisible, setReplyInputVisible] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const commentRef = useRef(null);
	const editInputRef = useRef(null);
	const { user } = useAuthContext();
	const { addComment, updateComment } = useComments();

	const nestedLevel = useRef(referenceArray.length / 2 - 2);

	const handleAddComment = () => {
		addComment(
			[...referenceArray, comment.id, 'comments'],
			user.displayName,
			user.photoURL,
			user.uid,
			commentRef.current.value,
		);
		commentRef.current.value = '';
		setReplyInputVisible(false);
	};

	const handleEditComment = () => {
		if (editInputRef.current.value === '') return;

		const updateObject = {
			commentContent: editInputRef.current.value,
		};

		updateComment([...referenceArray, comment.id], updateObject);

		editInputRef.current.value = '';
		setEditMode(false);
	};

	return (
		<div className='mt-2'>
			<div style={{ marginLeft: `${12 + 44 * nestedLevel.current}px` }}>
				<div className='flex gap-6'>
					<div>
						<Avatar size='xs' src={comment.commentorAvatar} />
					</div>
					<div className='grow'>
						<h3 className='text-xs font-bold'>{comment.createdBy}</h3>
						{!editMode && <p className='text-sm'>{comment.commentContent}</p>}
						{editMode && (
							<input
								type='text'
								ref={editInputRef}
								className='px-2 py-1 outline-none border-2 border-gray-600 rounded-md'
								placeholder={comment.commentContent}
							/>
						)}
						<div className='flex gap-3 text-xs'>
							<span
								onClick={() => setReplyInputVisible(true)}
								className='text-socialBlue cursor-pointer'
							>
								reply
							</span>
							{!editMode && user.uid === comment.userUID && (
								<span
									onClick={() => setEditMode(true)}
									className='text-socialBlue cursor-pointer'
								>
									edit
								</span>
							)}
							{editMode && (
								<span
									onClick={handleEditComment}
									className='text-socialBlue cursor-pointer'
								>
									update
								</span>
							)}
							{comment.createdAt && (
								<span>
									{formatDistanceToNow(comment.createdAt.toDate(), {
										addSuffix: true,
									})}
								</span>
							)}
						</div>
						{replyInputVisible && (
							<div className='border grow rounded-full relative mt-2'>
								<textarea
									ref={commentRef}
									className='block w-full py-1 px-3 h-8 rounded-full overflow-hidden resize-none'
									placeholder='Leave a comment'
								/>
								<button
									onClick={handleAddComment}
									className='absolute top-1 right-1 text-gray-400'
								>
									<SendIcon />
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<Comments referenceArray={[...referenceArray, comment.id, 'comments']} />
		</div>
	);
}
