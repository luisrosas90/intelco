<script lang="ts">
  import { onMount } from 'svelte';

  let message = 'Su pago está siendo validado. ¡Gracias por preferirnos!';

  onMount(() => {
    // Redirigir a la página principal después de 5 segundos
    setTimeout(() => {
      window.location.href = 'https://corpintelco.com';
    }, 5000);
  });
</script>

<section class="container mx-auto p-4">
  <div class="text-center">
    <h1 class="text-4xl font-bold text-blue-600 animated-message">{message}</h1>
    <p class="mt-4 text-lg">Será redirigido automáticamente a la página de inicio en unos segundos...</p>
  </div>
</section>

<style>
  section {
    padding: 1rem;
    text-align: center;
  }

  h1 {
    color: #1d8de3;
    font-size: 2rem; /* Tamaño más grande del texto */
    animation: grow 1.5s ease-in-out infinite; /* Aplicar animación */
  }

  /* Animación para el texto */
  @keyframes grow {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
</style>
