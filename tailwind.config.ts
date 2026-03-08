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
        primary: "#1e40af", // Blue-800
        secondary: "#1e293b", // Slate-800
        accent: "#f59e0b", // Amber-500
        background: "#f3f4f6", // Gray-100
        surface: "#ffffff",
        // Fashion Theme Colors
        fashion: {
          antique: "#f9f6f1", // Off-white/Cream
          silk: "#e5e1da",    // Light beige
          cashmere: "#8d7b68", // Earthy brown
          slate: "#2d2a2e",    // Premium dark
          gold: "#c5a059",     // Muted gold
        }
      },
    },
  },
  plugins: [],
};
export default config;
