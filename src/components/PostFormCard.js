import { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/config';

// components
import Avatar from './Avatar';
import Card from './Card';
import PhotoIcon from './icons/PhotoIcon';
import UserIcon from './icons/UserIcon';
import MapPinIcon from './icons/MapPinIcon';
import FaceSmileIcon from './icons/FaceSmileIcon';

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
		if (message === '' && photos.length === 0) return;

		const postImagesUrls = [];

		await Promise.all(
			photos.map(async (photo) => {
				const uploadPath = `photos/${user.uid}/${photo.name}`;
				const photosRef = ref(storage, uploadPath);
				await uploadBytes(photosRef, photo);
				const url = await getDownloadURL(photosRef);
				postImagesUrls.push(url);
			}),
		);

		const post = {
			content: message,
			photos: postImagesUrls,
			createdBy: user.uid,
			creatorName: user.displayName,
			comments: [],
			likes: [],
			shares: 0,
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
				<textarea
					className='grow p-3 h-14 resize-none'
					placeholder={`What's on your mind, ${
						user.displayName.split(' ')[0]
					}?`}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
			</div>
			{readerPhotos.length > 0 && (
				<div className='flex gap-2 max-w-full overflow-x-auto py-2'>
					{readerPhotos.map((photo) => (
						<div className='shrink-0' key={photo}>
							<img src={photo} alt={photo} className='w-24 h-24 rounded-md' />
						</div>
					))}
				</div>
			)}
			<div className='flex gap-5 items-center mt-2'>
				<div>
					<label className='flex gap-1 cursor-pointer'>
						<input
							onChange={handlePhotosChange}
							type='file'
							multiple
							className='hidden'
						/>
						<PhotoIcon />
						<span className='hidden md:block'>Photos</span>
					</label>
				</div>
				<div>
					<button className='flex gap-1'>
						<UserIcon />
						<span className='hidden md:block'>People</span>
					</button>
				</div>
				<div>
					<button className='flex gap-1'>
						<MapPinIcon />
						<span className='hidden md:block'>Check in</span>
					</button>
				</div>
				<div>
					<button className='flex gap-1'>
						<FaceSmileIcon />
						<span className='hidden md:block'>Mood</span>
					</button>
				</div>
				<div className='ml-auto'>
					<button
						onClick={handleClick}
						className='bg-socialBlue px-6 py-1 text-white rounded-md'
					>
						Share
					</button>
				</div>
			</div>
		</Card>
	);
}
