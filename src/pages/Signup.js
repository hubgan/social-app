import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// components
import Layout from '../components/Layout';
import Card from '../components/Card';

// hooks
import useSignup from '../hooks/useSignup';

export default function Signup() {
	const { pathname } = useLocation();
	const ref = useRef(null);
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [avatar, setAvatar] = useState(null);

	const { signup } = useSignup();

	const nonActiveClasses = 'w-1/2';
	const activeClasses =
		'w-1/2 border-socialBlue border-b-4 text-socialBlue font-bold';

	const handleFileInputClick = () => {
		ref.current.click();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(email, password, name, surname, avatar);
	};

	const handleFileChange = (e) => {
		setAvatar(null);
		const file = e.target.files[0];

		if (!file.type.includes('image')) {
			console.log('The file must be an image');
			return;
		}

		if (file.size > 100000) {
			console.log('The file size must be less than 100kb');
			return;
		}

		setAvatar(file);
	};

	const handleReset = (e) => {
		e.stopPropagation();
		setAvatar(null);
	};

	return (
		<Layout hideNavigation={true}>
			<div className='h-screen flex items-center'>
				<div className='max-w-xs md:max-w-lg mx-auto grow -mt-24'>
					<h1 className='text-6xl mb-4 text-gray-300 text-center'>Signup</h1>
					<Card noPadding={true}>
						<div className='p-4'>
							<div className='flex items-center text-center text-2xl mb-4'>
								<div
									className={
										pathname === '/login' ? activeClasses : nonActiveClasses
									}
								>
									<Link to={'/login'} className='block w-full'>
										Login
									</Link>
								</div>
								<div
									className={
										pathname === '/signup' ? activeClasses : nonActiveClasses
									}
								>
									<Link to={'/signup'} className='block w-full'>
										Signup
									</Link>
								</div>
							</div>
							<form
								onSubmit={handleSubmit}
								className='grid grid-cols-2 gap-3 p-4'
							>
								<div className='col-span-1 form-input relative z-10 border-2 focus-within:border-socialBlue rounded-md'>
									<input
										type='text'
										name='name'
										placeholder=' '
										className='block px-4 py-2 w-full text-lg appearance-none focus:outline-none bg-transparent rounded-md'
										required
										onChange={(e) => setName(e.target.value)}
									/>
									<label
										htmlFor='name'
										className='absolute top-0 left-0 text-lg bg-white px-4 py-2 -z-1 duration-300 origin-0'
									>
										Name
									</label>
								</div>
								<div className='col-span-1 form-input relative z-10 border-2 focus-within:border-socialBlue rounded-md'>
									<input
										type='text'
										name='surname'
										placeholder=' '
										className='block px-4 py-2 w-full text-lg appearance-none focus:outline-none bg-transparent rounded-md'
										required
										onChange={(e) => setSurname(e.target.value)}
									/>
									<label
										htmlFor='surname'
										className='absolute top-0 left-0 text-lg bg-white px-4 py-2 -z-1 duration-300 origin-0'
									>
										Surname
									</label>
								</div>
								<div className='col-span-2 form-input relative z-10 border-2 focus-within:border-socialBlue rounded-md'>
									<input
										type='email'
										name='email'
										placeholder=' '
										className='block px-4 py-2 w-full text-lg appearance-none focus:outline-none bg-transparent rounded-md'
										required
										onChange={(e) => setEmail(e.target.value)}
									/>
									<label
										htmlFor='email'
										className='absolute top-0 left-0 text-lg bg-white px-4 py-2 -z-1 duration-300 origin-0'
									>
										Email
									</label>
								</div>
								<div className='col-span-2 form-input relative z-10 border-2 focus-within:border-socialBlue rounded-md'>
									<input
										type='password'
										name='password'
										placeholder=' '
										className='block px-4 py-2 w-full text-lg appearance-none focus:outline-none bg-transparent rounded-md'
										required
										onChange={(e) => setPassword(e.target.value)}
									/>
									<label
										htmlFor='password'
										className='absolute top-0 left-0 text-lg bg-white px-4 py-2 -z-1 duration-300 origin-0'
									>
										Password
									</label>
								</div>
								<div className='col-span-2 border-2 rounded-md overflow-hidden'>
									<div
										onClick={handleFileInputClick}
										className='w-full flex items-center text-center hover:cursor-pointer relative'
									>
										<div className='w-2/6 p-2 bg-socialBlue text-white'>
											Click to browse
										</div>
										<div className='w-3/6 p-2 overflow-hidden text-ellipsis whitespace-nowrap'>
											{avatar ? avatar.name : 'Attach an avatar'}
										</div>
										<button
											onClick={handleReset}
											className='absolute right-3 z-[100]'
											type='button'
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth={1.5}
												stroke='currentColor'
												className='w-6 h-6'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M6 18L18 6M6 6l12 12'
												/>
											</svg>
										</button>
									</div>
									<input
										ref={ref}
										type='file'
										id='upload-input'
										className='hidden'
										onChange={handleFileChange}
									/>
								</div>
								<div className='col-span-2 flex items-center justify-center'>
									<button className='bg-socialBlue text-white px-6 py-2 rounded-md hover:cursor-pointer hover:bg-blue-500'>
										Signup
									</button>
								</div>
							</form>
						</div>
					</Card>
				</div>
			</div>
		</Layout>
	);
}
