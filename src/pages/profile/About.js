import React, { useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';

// components
import Card from '../../components/Card'

// hooks
import useAuthContext from '../../hooks/useAuthContext';

export default function About() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [about, setAbout] = useState('');
    const { id } = useParams();
    const { document, updateDocument } = useOutletContext();
    const { user } = useAuthContext();

    const handleSave = async () => {
        if (about === '') {
            setIsEditMode(false);
            return;
        }

        await updateDocument(id, { about: about });

        setAbout('');
        setIsEditMode(false);
    }

    return (
        <Card>
            <div className='relative'>
                <h2 className='text-3xl mb-2'>About me</h2>
                {!isEditMode && <p>{document && document.about}</p>}
                {isEditMode &&
                    <textarea className='w-full outline-none border-2 border-gray-600 px-3 py-1 resize-none text-sm h-32'
                        onChange={(e) => setAbout(e.target.value)}
                    />}
                {!isEditMode && id === user.uid && <button onClick={() => setIsEditMode(true)} className='absolute top-1 right-3 border-2 px-3 py-1 rounded-md border-gray-600'>
                    Edit
                </button>}
                {isEditMode && id === user.uid && <button onClick={handleSave} className='absolute top-1 right-3 border-2 px-3 py-1 rounded-md border-gray-600'>
                    Save
                </button>}
            </div>
        </Card>
    );
}
