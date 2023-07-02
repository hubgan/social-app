/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				socialBg: '#f5f7fb',
				socialBlue: '#218dfa',
			},
			transformOrigin: {
				0: '0%',
			},
			zIndex: {
				'-1': -1,
			},
			fontFamily: {
				'abril-fatface': ['"Abril Fatface"'],
			},
			keyframes: {
				slide: {
					'0%': { top: '-5%', opacity: '1' },
					'4%, 96%': { top: '5%', opacity: '1' },
					'100%': { top: '5%', opacity: '0' },
				},
			},
			animation: {
				modal: 'slide 5s linear forwards',
			},
		},
	},
	variants: {
		borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
	},
	plugins: [],
};

