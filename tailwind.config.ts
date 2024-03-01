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
      colors: {
        red: {
          "ff-300": '#FF8975',
          "ff-500": '#FF5436'
        },
        green: {
          "50-300": '#50EBCB',
          "50-500": '#50E3C2',
        },
        gray: {
          "eb-500": '#EBF1F1',
          "be-500": '#BEC3C7',
          "34-500": '#34495E',
          "2c-500": '#2C3F50',
        },
        blue: {
          "07-500": '#07B7DC',
          "00-500": '#00ABCF',
          "90-500": '#90B8F8',
          "5F-500": '#5F85DB',
        }
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' }
        }
      },
      animation: {
        'slideIn': 'slideIn 0.3s ease-in-out'
      }
    },
  },
  plugins: [],
};
export default config;
