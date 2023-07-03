import React from 'react';
import { useParams } from 'react-router-dom';

// Components
import CameraIcon from './icons/CameraIcon';

// hooks
import useAuthContext from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { useUploadFile } from '../hooks/useUploadFile';

export default function Cover({ cover }) {
	const { id } = useParams();
	const { user } = useAuthContext();

	const { updateDocument } = useFirestore('users');
	const { uploadFile } = useUploadFile();

	const handleCoverPhotoChange = async (e) => {
		const photo = e.target.files[0];
		const uploadPath = `photos/${id}/cover/${photo.name}`;
		const fileURL = await uploadFile(uploadPath, photo);

		updateDocument(id, { cover: fileURL });
	};

	return (
		<>
			<div className='relative flex justify-center items-center h-36 overflow-hidden'>
				<img src={cover} alt='profile background' />
				{id === user.uid && (
					<label className='absolute bottom-2 right-2 cursor-pointer'>
						<input
							onChange={handleCoverPhotoChange}
							type='file'
							className='hidden'
						/>
						<span className='flex items-center gap-2 px-3 py-1 rounded-md bg-white'>
							<CameraIcon />
							Change cover image
						</span>
					</label>
				)}
			</div>
		</>
	);
}
