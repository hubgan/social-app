import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { combineID } from '../utils/utils';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

// components
import Layout from '../components/Layout';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Cover from '../components/Cover';
import CameraIcon from '../components/icons/CameraIcon';
import DocumentTextIcon from '../components/icons/DocumentTextIcon';
import InformationIcon from '../components/icons/InformationIcon';
import UserGroupIcon from '../components/icons/UserGroupIcon';
import PhotoIcon from '../components/icons/PhotoIcon';

// hooks
import { useDocument } from '../hooks/useDocument';
import { useUploadFile } from '../hooks/useUploadFile';
import { useFirestore } from '../hooks/useFirestore';
import useAuthContext from '../hooks/useAuthContext';
import { updateProfile } from 'firebase/auth';
import { useCollection } from '../hooks/useCollection';

export default function ProfilePage() {
	const [isEditMode, setIsEditMode] = useState(false);
	const [location, setLocation] = useState('');
	const { pathname } = useLocation();
	const { id } = useParams();
	const { user } = useAuthContext();
	const { document } = useDocument('users', id);
	const { uploadFile } = useUploadFile();
	const { updateDocument } = useFirestore('users');
	const { addDocument } = useFirestore('notifications');
	const { documents: notifications } = useCollection('notifications', [
		{
			property: 'notificationID',
			operator: '==',
			value: combineID(user.uid, id),
		},
	]);

	const isFriendRequestSend =
		notifications && notifications.length > 0 ? true : false;

	const isPosts = pathname.includes('posts') || pathname === '/profile';
	const isAbout = pathname.includes('about');
	const isFriends = pathname.includes('friends');
	const isPhotos = pathname.includes('photos');
	const nonActiveTabClasses =
		'flex gap-1 px-4 py-1 items-center border-b-4 border-b-white';
	const activeTabClasses =
		'flex gap-1 px-4 py-1 items-center border-socialBlue border-b-4 text-socialBlue font-bold';

	const [posts, setPosts] = useState(null);
	const [postsLoading, setPostsLoading] = useState(false);
	const [postsError, setPostsError] = useState(null);

	useEffect(() => {
		setPostsLoading(true);

		let collectionRef = query(
			collection(db, 'posts'),
			where('createdBy', '==', id),
		);

		const unsub = onSnapshot(
			collectionRef,
			(snapshot) => {
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				setPosts(data);
				setPostsLoading(false);
				setPostsError(null);
			},
			(error) => {
				console.log(error);
				setPostsLoading(false);
				setPostsError(false);
			},
		);

		return () => unsub();
	}, [id]);

	const handleCoverPhotoChange = async (e) => {
		const photo = e.target.files[0];
		const uploadPath = `avatars/${id}/${photo.name}`;
		const fileURL = await uploadFile(uploadPath, photo);

		await updateProfile(user, { photoURL: fileURL });
		updateDocument(id, { avatar: fileURL });
	};

	const handleSaveLocation = async () => {
		setIsEditMode(false);

		if (location === '') {
			return;
		}

		await updateDocument(id, { location: location });

		setLocation('');
	};

	const handleAddFriend = async () => {
		const notificationID = combineID(user.uid, id);

		const notification = {
			type: 'FRIEND_REQUEST',
			sendBy: user.uid,
			sendTo: id,
			notificationID: notificationID,
			senderName: user.displayName,
		};

		await addDocument(notification);
	};

	return (
		<Layout>
			<Card noPadding={true}>
				<div className='relative rounded-md overflow-hidden'>
					{document && <Cover cover={document.cover} />}
					<div className='absolute top-24 left-4'>
						{document && <Avatar size={'lg'} src={document.avatar} />}
						{id === user.uid && (
							<label className='absolute right-0 bottom-0 bg-white p-2 rounded-full cursor-pointer shadow-md'>
								<input
									onChange={handleCoverPhotoChange}
									type='file'
									className='hidden'
								/>
								<span>
									<CameraIcon />
								</span>
							</label>
						)}
					</div>
					<div className='p-4 pb-0'>
						<div className='ml-24 md:ml-40 relative'>
							<h1 className='text-3xl font-bold'>
								{document && document.name}
							</h1>
							{!isEditMode && (
								<div className='text-gray-500 leading-4'>
									{document && document.location}
								</div>
							)}
							{isEditMode && (
								<input
									type='text'
									className='px-2 py-1 outline-none border-2 border-gray-600 rounded-md'
									placeholder={document.location}
									onChange={(e) => {
										setLocation(e.target.value);
									}}
								/>
							)}
							{!isEditMode && id === user.uid && (
								<button
									onClick={() => setIsEditMode(true)}
									className='absolute top-2 right-2 border-2 border-gray-600 px-3 py-1 rounded-md'
								>
									Edit Profile
								</button>
							)}
							{isEditMode && id === user.uid && (
								<button
									onClick={handleSaveLocation}
									className='absolute top-2 right-2 border-2 border-gray-600 px-3 py-1 rounded-md'
								>
									Save
								</button>
							)}
							{id !== user.uid &&
								!isFriendRequestSend &&
								document &&
								!document.friends.includes(user.uid) && (
									<button
										onClick={handleAddFriend}
										className='absolute top-2 right-2 border-2 border-gray-600 px-3 py-1 rounded-md'
									>
										Add to friends
									</button>
								)}
						</div>
						<div className='flex mt-4 md:mt-10'>
							<Link
								to={`/profile/${id}/posts`}
								className={isPosts ? activeTabClasses : nonActiveTabClasses}
							>
								<DocumentTextIcon />
								<span className='hidden sm:block'>Posts</span>
							</Link>
							<Link
								to={`/profile/${id}/about`}
								className={isAbout ? activeTabClasses : nonActiveTabClasses}
							>
								<InformationIcon />
								<span className='hidden sm:block'>About</span>
							</Link>
							<Link
								to={`/profile/${id}/friends`}
								className={isFriends ? activeTabClasses : nonActiveTabClasses}
							>
								<UserGroupIcon />
								<span className='hidden sm:block'>Friends</span>
							</Link>
							<Link
								to={`/profile/${id}/photos`}
								className={isPhotos ? activeTabClasses : nonActiveTabClasses}
							>
								<PhotoIcon />
								<span className='hidden sm:block'>Photos</span>
							</Link>
						</div>
					</div>
				</div>
			</Card>
			<Outlet
				context={{ document, updateDocument, posts, postsLoading, postsError }}
			/>
		</Layout>
	);
}
