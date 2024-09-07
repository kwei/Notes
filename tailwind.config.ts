import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "neon-cyan": "0px 22px 70px 4px rgba(255, 255, 255, 0.56)",
        "down-side": "0px 10px 10px -10px rgba(0, 0, 0, 0.3)",
        "magic-btn":
          "rgba(80, 235, 203, 0.4) 5px 5px, rgba(80, 235, 203, 0.3) 10px 10px, rgba(80, 235, 203, 0.2) 15px 15px, rgba(80, 235, 203, 0.1) 20px 20px, rgba(80, 235, 203, 0.05) 25px 25px",
      },
      colors: {
        red: {
          "ff-300": "#FF8975",
          "ff-500": "#FF5436",
        },
        green: {
          "50-300": "#50EBCB",
          "50-500": "#50E3C2",
        },
        gray: {
          "eb-500": "#EBF1F1",
          "d0-500": "#D0D0D0",
          "be-500": "#BEC3C7",
          "8b-500": "#8b8e91",
          "34-500": "#34495E",
          "2c-500": "#2C3F50",
          "1e-500": "#1E1B32",
          "40-300": "#4e4e50",
          "40-500": "#403F44",
        },
        blue: {
          "7d-500": "#7DF9FF",
          "07-500": "#07B7DC",
          "00-500": "#00ABCF",
          "90-500": "#90B8F8",
          "5F-500": "#5F85DB",
        },
      },
      keyframes: {
        slideInFromLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        slideOutToLeft: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        slideInFromBottom: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        slideOutToBottom: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(100%)" },
        },
        slideInFromTop: {
          "0%": { transform: "translateY(-200%)" },
          "100%": { transform: "translateY(0%)" },
        },
        slideOutToTop: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-200%)" },
        },
      },
      animation: {
        "slideIn-from-left": "slideInFromLeft 0.3s ease-in-out forwards",
        "slideOut-to-left": "slideOutToLeft 0.3s ease-in-out forwards",
        "slideIn-from-bottom": "slideInFromBottom 0.3s ease-in-out forwards",
        "slideOut-to-bottom": "slideOutToBottom 0.3s ease-in-out forwards",
        "slideIn-from-top": "slideInFromTop 0.2s ease-in-out forwards",
        "slideOut-to-top": "slideOutToTop 0.2s ease-in-out forwards",
      },
      grayscale: {
        30: "30%",
        50: "50%",
        75: "75%",
      },
      gridTemplateRows: {
        "0": "repeat(1, minmax(0, 0fr))",
      },
    },
  },
  plugins: [],
};
export default config;
