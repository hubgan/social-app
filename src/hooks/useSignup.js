import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import useAuthContext from './useAuthContext';

export default function useSignup() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isCancelled, setIsCancelled] = useState(false);
	const { dispatch } = useAuthContext();

	const signup = async (email, password, name, surname, avatar) => {
		setError(null);
		setIsLoading(true);

		try {
			const res = await createUserWithEmailAndPassword(auth, email, password);

			if (!res) {
				throw new Error('Could not complete signup');
			}

			const fullname = `${name} ${surname}`;

			let imgUrl = null;
			if (avatar) {
				const uploadPath = `avatars/${res.user.uid}/${avatar.name}`;
				const avatarsRef = ref(storage, uploadPath);
				await uploadBytes(avatarsRef, avatar);
				imgUrl = await getDownloadURL(avatarsRef);
			} else {
				imgUrl = process.env.REACT_APP_DEFAULT_PROFILE_AVATAR;
			}

			await updateProfile(res.user, {
				displayName: fullname,
				photoURL: imgUrl,
			});

			await setDoc(doc(db, 'users', res.user.uid), {
				id: res.user.uid,
				name: fullname,
				email: email,
				avatar: imgUrl,
				location: 'location...',
				about: 'about me...',
				cover: process.env.REACT_APP_DEFAULT_COVER_IMAGE,
				friends: [],
			});

			dispatch({ type: 'LOGIN', payload: res.user });

			if (!isCancelled) {
				setIsLoading(false);
				setError(null);
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message);
				setIsLoading(false);
				console.log(err.message);
			}
		}
	};

	useEffect(() => {
		setIsCancelled(false);

		return () => setIsCancelled(true);
	}, []);

	return { signup, error, isLoading };
}
