import { useState, useEffect } from 'react';

export default function ImageSlider({ data, isOpen, close }) {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const onKeyDown = (e) => {
			if (!e.key === 'Escape') return;

			close();
		};

		// Avoid scrolling when the slider is open
		document.body.style.height = '100vh';
		document.body.style.overflowY = 'hidden';
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.style.height = '';
			document.body.style.overflowY = '';
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [close]);

	const prevSlide = () => {
		const newIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
		setCurrentIndex(newIndex);
	};

	const nextSlide = () => {
		const newIndex = currentIndex === data.length - 1 ? 0 : currentIndex + 1;
		setCurrentIndex(newIndex);
	};

	return (
		<div className='fixed top-0 left-0 right-0 overflow-y-hidden h-screen flex items-center justify-center z-50 bg-zinc-700 '>
			<div className='max-w-lg h-[576px] w-full relative'>
				<div
					style={{ backgroundImage: `url('${data[currentIndex]}')` }}
					className='w-full h-full bg-no-repeat bg-center bg-contain'
				></div>
			</div>

			{data.length > 0 && currentIndex !== 0 && (
				<div
					onClick={prevSlide}
					className='absolute top-[50%] translate-y-[50%] left-5 cursor-pointer'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='white'
						className='w-8 h-8'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15.75 19.5L8.25 12l7.5-7.5'
						/>
					</svg>
				</div>
			)}

			{data.length > 0 && currentIndex !== data.length - 1 && (
				<div
					onClick={nextSlide}
					className='absolute top-[50%] translate-y-[50%] right-5 cursor-pointer'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='white'
						className='w-8 h-8'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M8.25 4.5l7.5 7.5-7.5 7.5'
						/>
					</svg>
				</div>
			)}

			<div
				onClick={() => close()}
				className='absolute top-5 right-5 cursor-pointer'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='white'
					className='w-8 h-8'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M6 18L18 6M6 6l12 12'
					/>
				</svg>
			</div>
		</div>
	);
}
