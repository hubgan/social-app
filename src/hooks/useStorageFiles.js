import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react"
import { storage } from "../firebase/config";

export const useStorageFiles = (path) => {
    const [files, setFiles] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);
    const [isCancelled, setIsCancelled] = useState(false);

    const getFiles = () => {
        setIsLoading(true);

        const filesRef = ref(storage, path);

        listAll(filesRef)
            .then((res) => {
                const promises = res.items.map((item) => getDownloadURL(item));
                Promise.all(promises).then((urls) => {
                    if (!isCancelled) {
                        setFiles(urls);
                        setIsLoading(false);
                    }
                });
            })
            .catch((error) => {
                if (!isCancelled) {
                    console.log(error)
                    setError(error.message);
                    setIsLoading(false);
                }
            });
    }

    useEffect(() => {
        setIsCancelled(false);

        return () => setIsCancelled(true);
    }, []);

    return { files, isLoading, error, getFiles };
}