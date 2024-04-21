/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#131417",
                secondary: "#1E1F26",
                primaryText: "#868CA0",
                text555: "#555",
                theme: "#33d2b7",
                themedark: "#4d9c8f",
            },
        },
    },
    plugins: [],
};
