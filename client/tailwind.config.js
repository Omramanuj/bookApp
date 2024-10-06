// @type {import('tailwindcss').Config}
module.exports = {
  content: [
    "./index.html",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgp: '#FAF7F0',  // Background Primary
        bgs: '#D8D2C2',  
        txtp:{
          100:'#C15E3C',
          200:'#C85E37',
        } , 
        txts: '#4A4947', 
      },
    },
  },
  plugins: [],
}
