import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        panel: "#f7f8fa",
        line: "#d7dde5",
        steel: "#3a4655",
        marine: "#0f4c81",
        cyan: "#1f9fb6",
        amber: "#c98314",
        success: "#23845c",
        danger: "#b83b3b"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(16, 24, 32, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
