/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			zIndex: {
				'header': '50',
				'modal': '100',
				'toast': '9000',
				'spinner': '9999',
			},
			colors: {
				primary: '#3C50E0',
				stroke: '#E2E8F0',
				body: '#64748B',
				boxdark: '#24303F',
				'meta-2': '#EFF2F7',
				'meta-3': '#10B981', // Success
				'meta-1': '#FB1111', // Danger
			},
			shadows: {
				default: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)',
			}
		}
	},
	plugins: [],
}