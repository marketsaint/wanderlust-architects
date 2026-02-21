/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx,mdx}',
    './src/components/**/*.{js,jsx,ts,tsx,mdx}',
    './src/lib/**/*.{js,jsx,ts,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        slate: '#121212',
        smoke: '#F5F5F5',
        mist: '#E5E5E5',
        iron: '#6B6B6B',
        silver: '#B9B9B9'
      },
      boxShadow: {
        soft: '0 20px 50px -30px rgba(0, 0, 0, 0.55)'
      },
      backgroundImage: {
        grain: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.12), transparent 30%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.08), transparent 25%)'
      }
    }
  },
  plugins: []
};
