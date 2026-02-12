/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    blue: '#00E5FF',
                    purple: '#7C4DFF',
                    green: '#00E676',
                    red: '#FF1744',
                },
                background: 'rgb(var(--bg-background))',
                foreground: 'rgb(var(--text-primary))',
                card: 'rgb(var(--bg-card))',
                dark: {
                    bg: '#0B0F1A',
                    card: 'rgba(255, 255, 255, 0.08)',
                }
            },
        },
    },
    plugins: [],
}
