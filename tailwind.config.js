/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.tsx",
    ],
    theme: {
        extend: {},
    },
    variants: {
        extend: {
            fontWeight: ["responsive", "hover", "focus"],
            opacity: ["hover"],
            borderColor: ["hover", "focus"],
            margin: ["first", "last"],
            backgroundColor: ["odd", "even"],
            scale: ["hover", "active", "group-hover"],
        },
    }
}