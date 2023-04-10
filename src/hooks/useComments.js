import { collection, doc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

export function useComments() {
    const addComment = async (referenceArray, createdBy, commentorAvatar, userUID, commentContent) => {
        const ref = doc(collection(...referenceArray));

        const [db, postCol, postID] = referenceArray;
        const postRef = doc(db, postCol, postID);

        const commentObject = {
            createdBy,
            commentorAvatar,
            commentContent,
            userUID,
            createdAt: serverTimestamp()
        };

        await Promise.all([setDoc(ref, commentObject), updateDoc(postRef, { numberOfComments: increment(1) })]);
    }

    const updateComment = async (referenceArray, updateObject) => {
        const ref = doc(...referenceArray);
        await updateDoc(ref, updateObject);
    }

    return { addComment, updateComment };
}