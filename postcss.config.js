// postcss.config.js
//Es el archivo de configuración principal para PostCSS (un pre-procesador de CSS). Su función clave es:

//Definir qué plugins de PostCSS usar
//(Tailwind CSS y Autoprefixer en tu caso)

//Controlar cómo se transforma tu CSS
//(antes de que el navegador lo reciba)


//Cuando ejecutas npm run dev:
//Vite → PostCSS (usa tu config) → CSS optimizado → Navegador

export default {
  plugins: {
    tailwindcss: {},// // Procesa las directivas @tailwind
    autoprefixer: {} //  // Añade prefijos (-webkit-, -moz-) automáticamente
  }
}