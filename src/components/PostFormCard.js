import { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/config';

// components
import Avatar from './Avatar';
import Card from './Card';

// hooks
import { useFirestore } from '../hooks/useFirestore';
import useAuthContext from '../hooks/useAuthContext';

export default function PostFormCard() {
    const [message, setMessage] = useState('');
    const [photos, setPhotos] = useState([]);
    const [readerPhotos, setReaderPhotos] = useState([]);
    const { user } = useAuthContext();
    const { addDocument } = useFirestore('posts');

    const handleClick = async () => {
        const postImagesUrls = [];

        await Promise.all(
            photos.map(async (photo) => {
                const uploadPath = `photos/${user.uid}/${photo.name}`;
                const photosRef = ref(storage, uploadPath);
                await uploadBytes(photosRef, photo);
                const url = await getDownloadURL(photosRef);
                postImagesUrls.push(url);
            })
        );

        const post = {
            content: message,
            photos: postImagesUrls,
            createdBy: user.uid,
            creatorName: user.displayName,
            creatorAvatar: user.photoURL,
            comments: [],
            likes: 0,
            shares: 0
        };

        addDocument(post);

        setMessage('');
        setPhotos([]);
        setReaderPhotos([]);
    };

    const handlePhotosChange = (e) => {
        const totalFiles = e.target.files.length;
        let loadedFiles = 0;
        const newImages = [];
        setPhotos([...e.target.files]);

        const handleReaderLoad = (e) => {
            loadedFiles++;
            newImages.push(e.target.result);

            if (loadedFiles === totalFiles) {
                setReaderPhotos(newImages);
            }
        };

        for (let i = 0; i < totalFiles; i++) {
            const reader = new FileReader();
            reader.onload = handleReaderLoad;
            reader.readAsDataURL(e.target.files[i]);
        }
    };

    return (
        <Card>
            <div className='flex gap-2'>
                <div>
                    <Avatar src={user.photoURL} />
                </div>
                <textarea className='grow p-3 h-14 resize-none' placeholder={`What's on your mind, David?`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            {readerPhotos.length > 0 && (
                <div className='flex gap-2'>
                    {readerPhotos.map((photo) => (
                        <div key={photo}>
                            <img src={photo} alt={photo} className='w-auto h-24 rounded-md' />
                        </div>
                    ))}
                </div>
            )}
            <div className='flex gap-5 items-center mt-2'>
                <div>
                    <label className='flex gap-1 cursor-pointer'>
                        <input onChange={handlePhotosChange} type='file' multiple className='hidden' />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className='hidden md:block'>Photos</span>
                    </label>
                </div>
                <div>
                    <button className='flex gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span className='hidden md:block'>People</span>
                    </button>
                </div>
                <div>
                    <button className='flex gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className='hidden md:block'>Check in</span>
                    </button>
                </div>
                <div>
                    <button className='flex gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                        </svg>
                        <span className='hidden md:block'>Mood</span>
                    </button>
                </div>
                <div className='ml-auto'>
                    <button onClick={handleClick} className='bg-socialBlue px-6 py-1 text-white rounded-md'>Share</button>
                </div>
            </div>
        </Card>
    );
}
