/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './layout/*.liquid',
        './templates/**/*.{liquid,json}',
        './sections/*.liquid',
        './snippets/*.liquid',
    ],
    theme: {
        extend: {
            colors: {
                bg: '#F9F8F6',
                text: '#222222',
                accent: '#C5A880',
                muted: '#8A8A8A',
                surface: '#FFFFFF',
                border: '#E8E5DF',
            },
            fontFamily: {
                heading: ['Rubik', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                accent: ['"Bricolage Grotesque"', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
