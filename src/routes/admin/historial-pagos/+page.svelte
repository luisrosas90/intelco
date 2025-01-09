<!-- src/routes/admin/historial/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
  
    let cajero_id = ''; // Aquí puedes asignar el ID del cajero logueado
    let historial = [];
    let errorMessage = '';
  
    const fetchHistorial = async () => {
      try {
        const response = await fetch(`/api/historial?cajero_id=${cajero_id}`);
        const data = await response.json();
  
        if (data.success) {
          historial = data.historial;
          console.log('Historial recibido:', historial);
        } else {
          errorMessage = data.message;
        }
      } catch (error) {
        errorMessage = 'Error al conectar con la API del historial.';
      }
    };
  
    // Suponiendo que puedes obtener el `cajero_id` al montar el componente
    onMount(() => {
      // Aquí debes asignar el cajero_id antes de llamar a fetchHistorial
      cajero_id = 'cajero2'; // Ejemplo, debes ajustar esto según la autenticación
      fetchHistorial();
    });
  </script>
  
  <section>
    <h2>Historial de Operaciones</h2>
    {#if errorMessage}
      <p>{errorMessage}</p>
    {/if}
  
    {#if historial.length > 0}
      <ul>
        {#each historial as operacion}
          <li>
            {operacion.tipo_operacion}: {operacion.monto} - {operacion.descripcion} ({new Date(operacion.fecha).toLocaleString()})
          </li>
        {/each}
      </ul>
    {:else}
      <p>No hay operaciones registradas.</p>
    {/if}
  </section>
  