/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "modal-bg": "rgba(28, 32, 42, 0.8)",
        "alert-bg": "rgba(28, 32, 42, 0.95)",
        "modal-line": "rgba(121,121,155,1)",
        "btn-bg": "rgba(97, 121, 156, 1)",
        "btn-bg-hover": "rgba(122, 151, 194, 1)",
        "white-sub": "rgba(221, 221, 221, 1)",
        "black-sub": "rgba(51, 51, 51, 1)",
      },
    },
    fontFamily: {
      Pretendard: ["Pretendard-Regular"],
      Star: ["Shining_star"],
    },
  },
  plugins: [],
};
