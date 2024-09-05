module.exports = {
  prefix: "tw-",
  content: [
    "./pages/**/*.{vue,js}",
    "./components/**/*.{vue,js}",
    "./layouts/**/*.{vue,js}",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f9589",
      },
    },
  },
  plugins: [],
};
