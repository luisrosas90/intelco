<script lang="ts">
  export let data; // Datos del cajero autenticado
  import { goto } from '$app/navigation';

  // Función para cerrar sesión
  const cerrarSesion = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST'
      });

      if (response.ok) {
        // Redirigir al login después de cerrar sesión
        goto('/login');
      } else {
        console.error('Error al cerrar sesión:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud de cierre de sesión:', error);
    }
  };
</script>

<!-- Menú de navegación -->
<nav class="bg-blue-600 p-4 shadow-md flex justify-between items-center">
  <!-- Botones del menú -->
  <div class="space-x-4">
    <a href="/{data.user}/dashboard" class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition-all">Inicio</a>
  </div>

  <!-- Botón de Cerrar Sesión -->
  <div class="space-x-4">
    {#if data.user}
      <button on:click={cerrarSesion} class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-all">
        Cerrar Sesión
      </button>
    {:else}
      <a href="/login" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition-all">
        Iniciar Sesión
      </a>
    {/if}
  </div>
</nav>

<!-- Contenido dinámico -->
<div class="mt-8 p-4">
  <slot />
</div>

<style>
  /* Estilo adicional opcional */
  nav {
    font-family: 'Arial', sans-serif;
  }
  button, a {
    font-weight: bold;
    transition: background-color 0.3s ease-in-out;
  }
</style>
