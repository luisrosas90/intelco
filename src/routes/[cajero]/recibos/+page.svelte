<script lang="ts">
  import { onMount } from 'svelte';

  interface Recibo {
    id: number;
    cliente_id: string;
    metodo_pago: string;
    monto: number;
    referencia_pago: string;
    created_at: string;
  }

  let recibos: Recibo[] = [];
  let errorMessage = '';

  const fetchRecibos = async () => {
    try {
      const response = await fetch('/api/cajeros/recibos'); // Verifica que esta ruta sea correcta
      const data = await response.json();

      if (response.ok && data.success) {
        recibos = data.recibos || [];
        if (recibos.length === 0) {
          errorMessage = 'No hay recibos disponibles.';
        }
      } else {
        errorMessage = data.message || 'Error al obtener los recibos.';
      }
    } catch (error) {
      errorMessage = 'Error al conectar con el servidor para obtener los recibos.';
      console.error('Error al obtener los recibos:', error); // Para depuración
    }
  };

  onMount(() => {
    fetchRecibos();
  });
</script>

<section>
  <h2 class="text-xl font-bold mb-4">Recibos</h2>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  {#if recibos.length > 0}
    <ul class="divide-y divide-gray-300">
      {#each recibos as recibo}
        <li class="py-2">
          <p><strong>ID Recibo:</strong> {reicbo.id}</p>
          <p><strong>Cliente ID:</strong> {recibo.cliente_id}</p>
          <p><strong>Método de Pago:</strong> {recibo.metodo_pago}</p>
          <p><strong>Monto:</strong> {recibo.monto} Bs</p>
          <p><strong>Referencia:</strong> {recibo.referencia_pago}</p>
          <p><strong>Fecha:</strong> {new Date(recibo.created_at).toLocaleDateString()}</p>
        </li>
      {/each}
    </ul>
  {:else if !errorMessage}
    <p>No hay recibos disponibles en este momento.</p>
  {/if}
</section>

<style>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .text-red-500 {
    color: #f87171;
  }

  .text-xl {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .font-bold {
    font-weight: bold;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .divide-y {
    border-bottom: 1px solid #e5e7eb;
  }

  .divide-gray-300 {
    border-color: #d1d5db;
  }
</style>
