// src/routes/logout/+page.svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(async () => {
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
      console.error('Error al solicitar el cierre de sesión:', error);
    }
  });
</script>

<p>Redirigiendo...</p>
