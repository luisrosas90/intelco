<script lang="ts">
  import '../../app.css';
  let usuario = '';
  let clave = '';
  let errorMessage = '';

  const iniciarSesion = async () => {
    const formData = new FormData();
    formData.append('usuario', usuario);
    formData.append('clave', clave);

    try {
      const response = await fetch('/login', {
        method: 'POST',
        body: formData // Asegurarse de que los datos se envían como FormData
      });

      const result = await response.json();
      console.log('Respuesta del servidor:', result);

      if (response.ok) {
        // Si todo es correcto, redirige manualmente desde el cliente
        console.log('Redirigiendo al dashboard...');
        window.location.href = `/${usuario}/dashboard`; // Redirigir al dashboard
      } else {
        errorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
        console.error('Error:', result.message); // Log para verificar cualquier error recibido del servidor
      }
    } catch (error) {
      errorMessage = 'Error en el servidor.';
      console.error('Error en el cliente:', error); // Log en caso de que ocurra un error en el fetch
    }
  };
</script>

<!-- Estructura del layout similar al dashboard -->
<div class="flex h-screen bg-gray-100">
  
  <!-- Navegación lateral -->
  <aside class="w-64 bg-white p-6 shadow-md">
    <div class="text-center mb-8">
      <h2 class="text-xl font-bold text-green-500"><img src="/logo.png" alt="Logo" class="w-50 h-35" /></h2>
    </div>
  </aside>

  <!-- Sección de contenido principal con el formulario de login -->
  <main class="flex-1 flex items-center justify-center p-6">
    <section class="w-full max-w-md px-5 py-6 mx-auto bg-white rounded-md shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-700 mb-4">Iniciar Sesión</h2>
      <form on:submit|preventDefault={iniciarSesion} class="space-y-4">
        <div>
          <label for="usuario" class="block text-lg font-medium text-gray-700 mb-2">Usuario</label>
          <input
            type="text"
            id="usuario"
            bind:value={usuario}
            required
            class="w-full py-3 px-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label for="clave" class="block text-lg font-medium text-gray-700 mb-2">Clave</label>
          <input
            type="password"
            id="clave"
            bind:value={clave}
            required
            class="w-full py-3 px-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none"
        >
          Iniciar Sesión
        </button>

        {#if errorMessage}
          <p class="text-center text-red-600 mt-4">{errorMessage}</p>
        {/if}
      </form>
    </section>
  </main>
</div>
