/* Style działają tylko wewnątrz #onb-app i bez globalnego resetu (preflight),
   żeby nie ruszać motywu WordPressa ani Elementora. Listę klas CLI bierze z panelu. */
module.exports = {
  content: [],
  important: '#onb-app',
  corePlugins: { preflight: false },
  safelist: ['opacity-50', 'pointer-events-none'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      colors: {
        canvas: '#F9F9F6',
        moss: { 50: '#F0F4EF', 100: '#DCE6D9', 600: '#3D5A44', 700: '#2F4735' }
      }
    }
  }
};
