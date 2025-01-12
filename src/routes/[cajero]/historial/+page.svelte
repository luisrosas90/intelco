<script lang="ts">
  import { onMount } from 'svelte';

  let recibos: any[] = [];
  let errorMessage = '';

  const fetchHistorial = async () => {
    try {
      const response = await fetch('/api/cajeros/historial');
      const data = await response.json();

      if (response.ok) {
        if (data.historial && data.historial.length > 0) {
          recibos = data.historial;
          errorMessage = '';
        } else {
          recibos = []; // Asegurarse de que recibos sea un array vacío
          errorMessage = 'No hay recibos para mostrar.';
        }
      } else {
        errorMessage = data.error || 'Error al obtener el historial.';
      }
    } catch (error) {
      errorMessage = 'Error al conectar con el servidor.';
      console.error('Error al obtener el historial:', error);
    }
  };

  onMount(() => {
    fetchHistorial();
  });
</script>

<section>
  <h2 class="text-xl font-bold mb-4">Historial de Transacciones</h2>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  {#if recibos.length > 0}
    <ul class="list-none p-0">
      {#each recibos as recibo}
        <li class="bg-gray-100 p-2 rounded mb-2">
          Fecha: {new Date(recibo.fecha).toLocaleString()} - Monto: {recibo.monto_bs} Bs - Método: {recibo.metodo_pago}
          {#if recibo.referencia}
            <br>Referencia: {recibo.referencia}
          {/if}
          {#if recibo.banco}
            <br>Banco: {recibo.banco}
          {/if}
          {#if recibo.telefono}
            <br>Teléfono: {recibo.telefono}
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  /* Estilos si los necesitas */
</style>