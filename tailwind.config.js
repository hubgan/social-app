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
		},
	},
	variants: {
		borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
	},
	plugins: [],
};
