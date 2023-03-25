// hooks
import { useParams } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore'
import { useUploadFile } from "../hooks/useUploadFile";

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
    }

    return (
        <>
            <div className='relative flex justify-center items-center h-36 overflow-hidden'>
                <img src={cover} alt='profile background' />
                {id === user.uid && <label className="absolute bottom-2 right-2 cursor-pointer">
                    <input onChange={handleCoverPhotoChange} type='file' className="hidden" />
                    <span className="flex items-center gap-2 px-3 py-1 rounded-md bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                        Change cover image
                    </span>
                </label>}
            </div>
        </>
    );
}
