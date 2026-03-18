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
                bg: '#F8F6F1',
                background: '#F8F6F1',
                text: '#0C0C0B',
                accent: '#C4A882',
                muted: '#8C8880',
                surface: '#FFFFFF',
                border: '#E5E2D9',
            },
            fontFamily: {
                heading: ['"Cormorant Garamond"', 'serif'],
                body: ['"DM Sans"', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
