/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
        "./app/**/*.{js,jsx}",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                "modal-bg": "rgba(28, 32, 42, 0.8)",
                "alert-bg": "rgba(28, 32, 42, 0.95)",
                "modal-line": "rgba(121,121,155,1)",
                "btn-bg": "rgba(97, 121, 156, 1)",
                "btn-bg-hover": "rgba(122, 151, 194, 1)",
                "white-sub": "rgba(221, 221, 221, 1)",
                "black-sub": "rgba(51, 51, 51, 1)",
                "kakao-label": "rgba(0,0,0,0.85)",
                "modal-outside": "rgba(0 ,0 ,0 ,0.4)",
                kakao: "rgba(254,229,0)",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                fontFamily: {
                    Pretendard: ["Pretendard-Regular"],
                    Star: ["Shining_star"],
                },
            },
            backgroundColor: {
                "btn-bg": "rgba(97, 121, 156, 1)",
                "btn-bg-hover": "rgba(122, 151, 194, 1)",
                "modal-bg": "rgba(28, 32, 42, 0.8)",
                "alert-bg": "rgba(28, 32, 42, 0.95)",
                "modal-line": "rgba(121,121,155,1)",
                "btn-bg": "rgba(97, 121, 156, 1)",
                "btn-bg-hover": "rgba(122, 151, 194, 1)",
                "white-sub": "rgba(221, 221, 221, 1)",
                "black-sub": "rgba(51, 51, 51, 1)",
            },
            textColor: {
                "white-sub": "rgba(221, 221, 221, 1)",
                "black-sub": "rgba(51, 51, 51, 1)",
            },
            borderColor: {
                "white-sub": "rgba(221, 221, 221, 1)",
            },
            ringColor: {
                "white-sub": "rgba(221, 221, 221, 1)",
            },

            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                button: "0.75rem",
                input: "0.6rem",
                component: "1.25rem",
            },
            height: {
                input: "1.875rem",
                button: "2.375rem",
                login: "31.625rem",
                searchBar: "2.5rem",
                pic: "32rem",
            },
            maxHeight: {
                pic: "32rem",
            },
            width: {
                cardContainer: "59.188rem",
                searchBar: "25rem",
                pic: "32rem",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "slide-out": {
                    from: { transform: "translate(-10px)", opacity: "0" },
                    to: { transform: "translate(0px)", opacity: "1" },
                },
                "fade-in": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "slide-out": "slide-out 0.4s ease-in-out",
                "fade-in": "fade-in 0.3s ease-in-out",
                "fade-in-l": "fade-in 0.8s ease-in-out",
            },
        },
    },
    extend: {
        colors: {
            "modal-bg": "rgba(28, 32, 42, 0.8)",
            "alert-bg": "rgba(28, 32, 42, 0.95)",
            "modal-line": "rgba(121,121,155,1)",
            "btn-bg": "rgba(97, 121, 156, 1)",
            "btn-bg-hover": "rgba(122, 151, 194, 1)",
            "white-sub": "rgba(221, 221, 221, 1)",
            "black-sub": "rgba(51, 51, 51, 1)",
            "modal-outside": "rgba(0 ,0 ,0 ,0.7)",
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            primary: {
                DEFAULT: "hsl(var(--primary))",
                foreground: "hsl(var(--primary-foreground))",
            },
            secondary: {
                DEFAULT: "hsl(var(--secondary))",
                foreground: "hsl(var(--secondary-foreground))",
            },
            destructive: {
                DEFAULT: "hsl(var(--destructive))",
                foreground: "hsl(var(--destructive-foreground))",
            },
            muted: {
                DEFAULT: "hsl(var(--muted))",
                foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
                DEFAULT: "hsl(var(--accent))",
                foreground: "hsl(var(--accent-foreground))",
            },
            popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))",
            },
            card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))",
            },
            fontFamily: {
                Pretendard: ["Pretendard-Regular"],
                Star: ["Shining_star"],
            },
        },
        backgroundColor: {
            "btn-bg": "rgba(97, 121, 156, 1)",
            "btn-bg-hover": "rgba(122, 151, 194, 1)",
        },
        borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
            custom: "0.6rem",
        },
        keyframes: {
            "accordion-down": {
                from: { height: "0" },
                to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: "0" },
            },
        },
        animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
        },
    },

    plugins: [require("tailwindcss-animate")],
};
