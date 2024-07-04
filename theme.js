import './style.css'; // Importa il file CSS con le definizioni @font-face

// src/theme.js
const customTheme = {
    colors: {
      brand: [
        "#D5D9DD",
        "#BEC6CD",
        "#A7B4C0",
        "#90A4B6",
        "#7996B0",
        "#6089AE",
        "#497DAC",
        "#4B7092",
        "#4A657D",
        "#475A6C",
        "#43515E",
        "#3F4952",
        "#3A4148"
      ],
    },
    primaryColor: 'brand',
    fontFamily: 'Nunito-Variable, sans-serif',
    headings: {
      fontFamily: 'Nunito-Variable, sans-serif', // Font predefinito per tutti i livelli di heading
      fontWeight: '700', // Usa il grassetto per gli headings
      sizes: {
        h1: { fontWeight: '700', fontSize: '36px', lineHeight: 1.2 },
        h2: { fontWeight: '700', fontSize: '32px', lineHeight: 1.3 },
        h3: { fontWeight: '700', fontSize: '28px', lineHeight: 1.4 },
        h4: { fontWeight: '700', fontSize: '24px', lineHeight: 1.5 },
        h5: { fontWeight: '700', fontSize: '20px', lineHeight: 1.6 },
        h6: { fontWeight: '400', fontSize: '16px', lineHeight: 1.7 },
      },
    },
    spacing: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 24,
      xl: 32,
    },
  };
  
  export default customTheme;
