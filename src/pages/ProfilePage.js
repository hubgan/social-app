import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { combineID } from '../utils/utils'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

// components
import Layout from '../components/Layout';
import Card from '../components/Card';
import Avatar from '../components/Avatar'
import Cover from '../components/Cover';

// hooks
import { useDocument } from '../hooks/useDocument'
import { useUploadFile } from '../hooks/useUploadFile'
import { useFirestore } from '../hooks/useFirestore'
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
    const { documents: notifications } = useCollection('notifications', [{ property: 'notificationID', operator: '==', value: combineID(user.uid, id) }])

    const isFriendRequestSend = notifications && notifications.length > 0 ? true : false;

    const isPosts = pathname.includes('posts') || pathname === '/profile';
    const isAbout = pathname.includes('about');
    const isFriends = pathname.includes('friends');
    const isPhotos = pathname.includes('photos');
    const nonActiveTabClasses = 'flex gap-1 px-4 py-1 items-center border-b-4 border-b-white';
    const activeTabClasses = 'flex gap-1 px-4 py-1 items-center border-socialBlue border-b-4 text-socialBlue font-bold';

    const [posts, setPosts] = useState(null);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState(null);

    useEffect(() => {
        setPostsLoading(true);

        let collectionRef = query(collection(db, 'posts'), where('createdBy', '==', id));

        const unsub = onSnapshot(collectionRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setPosts(data);
            setPostsLoading(false);
            setPostsError(null);
        }, (error) => {
            console.log(error);
            setPostsLoading(false);
            setPostsError(false);
        });

        return () => unsub();
    }, [id])

    const handleCoverPhotoChange = async (e) => {
        const photo = e.target.files[0];
        const uploadPath = `avatars/${id}/${photo.name}`;
        const fileURL = await uploadFile(uploadPath, photo);

        await updateProfile(user, { photoURL: fileURL });
        updateDocument(id, { avatar: fileURL });
    }

    const handleSaveLocation = async () => {
        setIsEditMode(false);

        if (location === '') {
            return;
        }

        await updateDocument(id, { location: location });

        setLocation('');
    }

    const handleAddFriend = async () => {
        const notificationID = combineID(user.uid, id);

        const notification = {
            type: 'FRIEND_REQUEST',
            sendBy: user.uid,
            sendTo: id,
            notificationID: notificationID,
            senderName: user.displayName
        }

        await addDocument(notification);
    }

    return (
        <Layout>
            <Card noPadding={true}>
                <div className='relative rounded-md overflow-hidden'>
                    {document && <Cover cover={document.cover} />}
                    <div className='absolute top-24 left-4'>
                        {document && <Avatar size={'lg'} src={document.avatar} />}
                        {id === user.uid && <label className='absolute right-0 bottom-0 bg-white p-2 rounded-full cursor-pointer shadow-md'>
                            <input onChange={handleCoverPhotoChange} type='file' className='hidden' />
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                            </span>
                        </label>}
                    </div>
                    <div className='p-4 pb-0'>
                        <div className='ml-24 md:ml-40 relative'>
                            <h1 className='text-3xl font-bold'>{document && document.name}</h1>
                            {!isEditMode && <div className='text-gray-500 leading-4'>
                                {document && document.location}
                            </div>}
                            {isEditMode && <input type='text' className='px-2 py-1 outline-none border-2 border-gray-600 rounded-md' placeholder={document.location}
                                onChange={(e) => { setLocation(e.target.value) }}
                            />}
                            {!isEditMode && id === user.uid && <button onClick={() => setIsEditMode(true)} className='absolute top-2 right-2 border-2 border-gray-600 px-3 py-1 rounded-md'>
                                Edit Profile
                            </button>}
                            {isEditMode && id === user.uid && <button onClick={handleSaveLocation} className='absolute top-2 right-2 border-2 border-gray-600 px-3 py-1 rounded-md'>
                                Save
                            </button>}
                            {id !== user.uid && !isFriendRequestSend && document && !document.friends.includes(user.uid) &&
                                <button onClick={handleAddFriend} className='absolute top-2 right-2 border-2 border-gray-600 px-3 py-1 rounded-md'>
                                    Add to friends
                                </button>
                            }
                        </div>
                        <div className='flex mt-4 md:mt-10'>
                            <Link to={`/profile/${id}/posts`} className={isPosts ? activeTabClasses : nonActiveTabClasses}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                <span className='hidden sm:block'>Posts</span>
                            </Link>
                            <Link to={`/profile/${id}/about`} className={isAbout ? activeTabClasses : nonActiveTabClasses}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                <span className='hidden sm:block'>About</span>
                            </Link>
                            <Link to={`/profile/${id}/friends`} className={isFriends ? activeTabClasses : nonActiveTabClasses}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                                <span className='hidden sm:block'>Friends</span>
                            </Link>
                            <Link to={`/profile/${id}/photos`} className={isPhotos ? activeTabClasses : nonActiveTabClasses}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <span className='hidden sm:block'>Photos</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
            <Outlet context={{ document, updateDocument, posts, postsLoading, postsError }} />
        </Layout>
    );
}
