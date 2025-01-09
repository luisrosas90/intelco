// import { defineConfig } from 'vite';
// import { sveltekit } from '@sveltejs/kit/vite';
// import fs from 'fs';
// import path from 'path';

// export default defineConfig({
//   plugins: [sveltekit()],
//   server: {
//     // Configuración de HTTPS para desarrollo (opcional)
//     https: {
//       key: fs.readFileSync(path.resolve(__dirname, 'static/ssl/ssl/key.pem')), // Ajusta la ruta a tu archivo SSL
//       cert: fs.readFileSync(path.resolve(__dirname, 'static/ssl/ssl/cert.pem')), // Ajusta la ruta a tu archivo SSL
//     },
//     // Configuración del proxy para redirigir las solicitudes al backend
//     proxy: {
//       '/api': {
//         target: 'https://reporte.corpintelco.com', // URL del backend
//         changeOrigin: true, // Cambia el origen de la solicitud
//         secure: true, // Asegura que el proxy utilice HTTPS
//         rewrite: (path) => path.replace(/^\/api/, ''), // Elimina el prefijo '/api' de la ruta
//         configure: (proxy, options) => {
//           // Se puede agregar configuración adicional si es necesario
//           proxy.on('proxyReq', (proxyReq, req, res) => {
//             // Agregar las cabeceras de CORS (si fuera necesario)
//             res.setHeader('Access-Control-Allow-Origin', '*');
//             res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//             res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//           });
//         },
//       },
//     },
//   },
//   build: {
//     target: 'esnext',
//   },
// });






// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';

// export default defineConfig({
// 	plugins: [sveltekit()],
// 	server: {
// 		origin: 'http://localhost:5173',
// 		host: 'localhost',
// 		port: 5173
// 	},
// 	test: {
// 		include: ['src/**/*.{test,spec}.{js,ts}']
// 	}
// });







//  import { defineConfig } from 'vite';
// import { sveltekit } from '@sveltejs/kit/vite';

// export default defineConfig({
//   plugins: [sveltekit()],
//   server: {
//     https: {
//       key: 'static/ssl/ssl/key.pem',
//       cert: 'static/ssl/ssl/cert.pem',
//     },
//   },
// });




import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    target: 'esnext', // Cloudflare Workers soporta ESNext
    minify: 'esbuild', // Usa esbuild para optimizar la velocidad de compilación
    outDir: 'build', // Carpeta de salida para el código de producción
  },
  server: {
    fs: {
      strict: false, // Permite importar desde fuera del directorio raíz si es necesario
    },
  },
  optimizeDeps: {
    include: ['axios', 'dotenv', 'mysql2'], // Añade dependencias necesarias para el backend
  },
});





// import { defineConfig } from 'vite';
// import { sveltekit } from '@sveltejs/kit/vite';
// import fs from 'fs';
// import path from 'path';

// export default defineConfig({
//   plugins: [sveltekit()],
  
//   server: {
//     https: {
//       key: fs.readFileSync(path.resolve(__dirname, 'static/ssl/ssl/key.pem')), // Ajusta la ruta a tu archivo SSL
//       cert: fs.readFileSync(path.resolve(__dirname, 'static/ssl/ssl/cert.pem')), // Ajusta la ruta a tu archivo SSL
//     },
//     host: 'localhost', // Cambia según sea necesario
//     port: 3000,        // El puerto que desees para desarrollo
//     proxy: {
//       '/api': {
//         target: 'https://reporte.corpintelco.com',  // URL de tu API backend
//         changeOrigin: true,
//         secure: true,  // Si tu API backend no tiene SSL o si usas SSL para pruebas locales
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },

//   build: {
//     target: 'esnext',
//     outDir: 'build', // Directorio donde se generará la compilación
//   },
// });


// import { defineConfig } from 'vite';
// import { sveltekit } from '@sveltejs/kit/vite';

// export default defineConfig({
//   plugins: [sveltekit()],
//   server: {
//     host: '0.0.0.0', // Asegúrate de que la aplicación sea accesible desde cualquier red (si es necesario).
//     port: 3000,       // Puerto de producción (3000 o cualquier puerto que desees).
//   },
//   build: {
//     target: 'esnext',    // Asegura que la compilación sea lo más moderna posible.
//     outDir: 'build',     // Directorio de salida en producción.
//   }
// });


// import { defineConfig } from 'vite';
// import { sveltekit } from '@sveltejs/kit/vite';

// export default defineConfig({
//   plugins: [sveltekit()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://reporte.corpintelco.com',
//         changeOrigin: true,
//         secure: true
//       }
//     }
//   },
//   build: {
//     target: 'esnext'
//   }
// });