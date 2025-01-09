<script lang="ts">
  import { onMount } from 'svelte';

  let recibos: any[] = []; // Inicializar como array vacío
  let errorMessage = '';

  const fetchHistorial = async () => {
    try {
      const response = await fetch('/api/cajeros/historial');
      const data = await response.json();

      if (response.ok && data.success) {
        recibos = data.recibos || []; // Asegurarse de que sea siempre un array
        if (recibos.length === 0) {
          errorMessage = 'No hay recibos generados hoy.';
        }
      } else {
        errorMessage = data.message || 'Error al obtener el historial.';
      }
    } catch (error) {
      errorMessage = 'Error al conectar con el servidor para obtener el historial.';
      console.error('Error al obtener el historial:', error);
    }
  };

  onMount(() => {
    fetchHistorial();
  });
</script>

<section>
  <h2>Historial de Transacciones</h2>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  {#if recibos.length > 0}
    <ul>
      {#each recibos as recibo}
        <li>
          Fecha: {recibo.fecha} - Monto: {recibo.monto} Bs - Método: {recibo.metodo_pago}
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 0.5rem 0;
    background-color: #f1f1f1;
    padding: 0.5rem;
    border-radius: 5px;
  }
</style>
