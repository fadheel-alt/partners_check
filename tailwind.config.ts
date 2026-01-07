import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Softer romantic pastels
        'pastel-pink': '#FFE5EC',
        'pastel-rose': '#FFF0F3',
        'pastel-lavender': '#F3E5F5',
        'pastel-peach': '#FFE4E1',
        'pastel-cream': '#FFF5E1',
        'romantic-pink': '#FFB7C5',
        'romantic-purple': '#D8B5FF',
      },
      maxWidth: {
        'mobile': '390px',
      },
    },
  },
  plugins: [],
};
export default config;
