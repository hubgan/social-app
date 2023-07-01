import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { throttle } from 'lodash';
import { formatDistanceToNow } from 'date-fns';

// components
import Avatar from './Avatar';
import Card from './Card';
import PostMenu from './PostMenu';

// hooks
import useComponentVisible from '../hooks/useComponentVisible';
import useAuthContext from '../hooks/useAuthContext';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';
import Comments from './Comments';
import { db } from '../firebase/config';
import { useComments } from '../hooks/useComments';
import Portal from './Portal';
import ImageSlider from './ImageSlider';

export default function PostCard({ post }) {
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);
	const { user } = useAuthContext();
	const { document } = useDocument('users', post.createdBy);
	const { updateDocument } = useFirestore('posts');
	const { addComment } = useComments();
	const [likesCount, setLikesCount] = useState(post.likes.length);
	const [liked, setLiked] = useState(
		post.likes.some((like) => like === user.uid),
	);
	const [isSliderOpen, setIsSliderOpen] = useState(false);
	const commentRef = useRef(null);

	const handleLike = throttle(async () => {
		let likes;
		if (liked) {
			setLikesCount((prevCount) => prevCount - 1);
			setLiked(false);
			likes = post.likes.filter((like) => like !== user.uid);
		} else {
			setLikesCount((prevCount) => prevCount + 1);
			setLiked(true);
			likes = [...post.likes, user.uid];
		}

		await updateDocument(post.id, { likes });
	}, 1000);

	const handleAddComment = () => {
		const referenceArray = [db, 'posts', post.id, 'comments'];
		addComment(
			referenceArray,
			user.displayName,
			user.photoURL,
			user.uid,
			commentRef.current.value,
		);
		commentRef.current.value = '';
	};

	const closeSlider = () => {
		setIsSliderOpen(false);
	};

	return (
		<Card>
			<div className='flex gap-3'>
				<div>
					<Link to={`/profile/${post.createdBy}/posts`}>
						<span className='cursor-pointer'>
							{document && <Avatar src={document.avatar} />}
						</span>
					</Link>
				</div>
				<div>
					<p>
						<Link to={`/profile/${post.createdBy}/posts`}>
							<span className='font-semibold cursor-pointer hover:underline'>
								{post.creatorName}
							</span>
						</Link>
						<span> shared a </span>
						<span className='text-socialBlue inline-block'>post</span>
					</p>
					{post.createdAt && (
						<p className='text-gray-500 text-sm'>
							{formatDistanceToNow(post.createdAt.toDate(), {
								addSuffix: true,
							})}
						</p>
					)}
				</div>
				<div className='ml-auto'>
					<PostMenu
						refProp={ref}
						isComponentVisible={isComponentVisible}
						setIsComponentVisible={setIsComponentVisible}
					/>
				</div>
			</div>
			<div>
				<p className='my-3 text-sm'>{post.content}</p>
				<div
					onClick={() => setIsSliderOpen(true)}
					className='rounded-md overflow-hidden cursor-pointer relative'
				>
					{post.photos.length > 0 && <img src={post.photos[0]} alt='post' />}
					{post.photos.length > 1 && (
						<p className='absolute top-1 left-1 font-abril-fatface text-5xl'>
							+{post.photos.length - 1} More
						</p>
					)}
				</div>
				<Portal
					Component={ImageSlider}
					data={post.photos}
					isOpen={isSliderOpen}
					close={closeSlider}
				/>
			</div>
			<div className='mt-5 flex gap-8'>
				<button onClick={handleLike} className='flex gap-2 items-center'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill={liked ? 'red' : 'none'}
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke={liked ? 'red' : 'currentColor'}
						className='w-6 h-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
						/>
					</svg>
					{likesCount}
				</button>
				<button className='flex gap-2 items-center'>
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
							d='M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
						/>
					</svg>
					{post.numberOfComments || 0}
				</button>
				<button className='flex gap-2 items-center'>
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
							d='M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z'
						/>
					</svg>
					{post.shares}
				</button>
			</div>
			<div className='flex gap-3 mt-4'>
				<div>
					<Avatar src={user.photoURL} />
				</div>
				<div className='border grow rounded-full relative'>
					<textarea
						ref={commentRef}
						className='block w-full py-3 px-4 h-12 rounded-full overflow-hidden resize-none'
						placeholder='Leave a comment'
					/>
					<button
						onClick={handleAddComment}
						className='absolute top-3 right-3 text-gray-400'
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
								d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
							/>
						</svg>
					</button>
				</div>
			</div>
			<div>
				<Comments referenceArray={[db, 'posts', post.id, 'comments']} />
			</div>
		</Card>
	);
}
