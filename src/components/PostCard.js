import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { throttle } from 'lodash';
import { formatDistanceToNow } from 'date-fns';

// components
import Avatar from './Avatar';
import Card from './Card';
import PostMenu from './PostMenu';
import SendIcon from './icons/SendIcon';
import HeartIcon from './icons/HeartIcon';
import ChatIcon from './icons/ChatIcon';
import ShareIcon from './icons/ShareIcon';

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
						createdBy={post.createdBy}
						postId={post.id}
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
					<HeartIcon
						fill={liked ? 'red' : undefined}
						stroke={liked ? 'red' : undefined}
					/>
					{likesCount}
				</button>
				<button className='flex gap-2 items-center'>
					<ChatIcon />
					{post.numberOfComments || 0}
				</button>
				<button className='flex gap-2 items-center'>
					<ShareIcon />
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
						<SendIcon />
					</button>
				</div>
			</div>
			<div>
				<Comments referenceArray={[db, 'posts', post.id, 'comments']} />
			</div>
		</Card>
	);
}
