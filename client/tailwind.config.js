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
                    blue: '#00f3ff',
                    purple: '#bc13fe',
                    green: '#39ff14',
                },
                background: 'rgb(var(--bg-background))',
                foreground: 'rgb(var(--text-primary))',
                card: 'rgb(var(--bg-card))',
                dark: {
                    bg: '#0a0a0a', // Keep legacy for fixed dark elements
                    card: '#1a1a1a',
                }
            },
        },
    },
    plugins: [],
}
