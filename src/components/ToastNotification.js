import React, { useEffect } from 'react';

export default function ToastNotification({ close, data: { message, Icon } }) {
	useEffect(() => {
		const timeout = setTimeout(() => {
			close();
		}, 5000);

		return () => clearTimeout(timeout);
	}, [close]);

	return (
		<div className='fixed top-5 w-96 right-5 overflow-y-hidden flex items-center gap-7 z-50 bg-white border-neutral-500 border animate-modal'>
			<div className='bg-orange-500 py-2 px-3'>
				<Icon stroke='white' />
			</div>
			<div>
				<p>{message}</p>
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
