import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../firebase/config";

export const useUploadFile = () => {
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);
    const [isCancelled, setIsCancelled] = useState(false);

    const uploadFile = async (path, file) => {
        setIsLoading(true);
        let url;

        try {
            const photosRef = ref(storage, path);
            await uploadBytes(photosRef, file);
            url = await getDownloadURL(photosRef);

            if (!isCancelled) {
                setIsLoading(false);
            }
        } catch (error) {
            if (!isCancelled) {
                console.log(error);
                setError(error.message);
                setIsLoading(false);
            }
        }

        return url;
    }

    useEffect(() => {
        setIsCancelled(false);

        return () => setIsCancelled(true);
    }, []);

    return { isLoading, error, uploadFile };
}