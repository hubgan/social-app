import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

// components
import Card from '../../components/Card';

// hooks
import { useStorageFiles } from '../../hooks/useStorageFiles';

export default function Photos() {
    const { id } = useParams();
    const { files, getFiles } = useStorageFiles(`/photos/${id}`);

    useEffect(() => {
        getFiles();
    }, [getFiles]);

    return (
        <Card>
            <div className='grid md:grid-cols-2 gap-4'>
                {files && files.map((photo) => (
                    <div key={photo} className='flex items-center rounded-md h-48 overflow-hidden'>
                        <img src={photo} alt='user album' />
                    </div>
                ))}
            </div>
        </Card>
    );
}
