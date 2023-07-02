import React, { useEffect } from 'react';

export default function ToastNotification({ data, close }) {
	useEffect(() => {
		const timeout = setTimeout(() => {
			close();
		}, 5000);

		return () => clearTimeout(timeout);
	}, [close]);

	return (
		<div className='fixed top-5 w-96 right-5 overflow-y-hidden flex items-center gap-7 z-50 bg-white border-neutral-500 border animate-modal'>
			<div className='bg-orange-500 py-2 px-3'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='white'
					className='w-7 h-7'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
					/>
				</svg>
			</div>
			<div>
				<p>{data.message}</p>
			</div>
			<button onClick={close} className='justify-end'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='#27272a'
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
	);
}
