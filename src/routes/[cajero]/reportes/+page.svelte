<script lang="ts">
  import { onMount } from 'svelte';

  interface Reporte {
    id: number;
    cliente_id: number;
    monto: number;
    referencia_pago: string;
    metodo_pago: string;
    banco: string;
    factura_id: number;
    telefono: string;
  }

  interface Recibo {
    id: number;
    cliente_id: number;
    monto: number;
    metodo_pago: string;
    fecha: string;
  }

  let reportesPendientes: Reporte[] = [];
  let historialRecibos: Recibo[] = [];
  let errorMessage: string = '';
  let successMessage: string = '';
  let printRecibosUrl = '/api/recibos/imprimir';

  const fetchReportesPendientes = async () => {
    try {
      const response = await fetch('/api/cajeros/reportes');
      const data = await response.json();

      if (response.ok && data.success) {
        reportesPendientes = data.reportes;
      } else {
        errorMessage = data.message || 'Error al obtener los reportes pendientes.';
      }
    } catch (error) {
      errorMessage = 'Error al conectar con la API de reportes pendientes.';
      console.error('Error al obtener reportes pendientes:', error);
    }
  };

  const fetchHistorial = async () => {
    try {
      const response = await fetch('/api/cajeros/historial');
      const data = await response.json();

      if (response.ok && data.success) {
        historialRecibos = data.recibos;
      } else {
        errorMessage = data.message || 'Error al obtener el historial de recibos.';
      }
    } catch (error) {
      errorMessage = 'Error al conectar con la API del historial de recibos.';
      console.error('Error al obtener historial de recibos:', error);
    }
  };

  const imprimirRecibos = () => {
    window.open(printRecibosUrl, '_blank');
  };

  onMount(() => {
    fetchReportesPendientes();
    fetchHistorial();
  });
</script>

<section>
  <h1>Reportes Pendientes de Validación</h1>
  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  {#if reportesPendientes.length > 0}
    <ul>
      {#each reportesPendientes as reporte}
        <li class="mb-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <p><strong>Cliente ID:</strong> {reporte.cliente_id}</p>
          <p><strong>Monto:</strong> {reporte.monto} USD</p>
          <p><strong>Número de Teléfono:</strong> {reporte.telefono}</p>
          <p><strong>Referencia de Pago:</strong> {reporte.referencia_pago}</p>
          <p><strong>Banco Emisor:</strong> {reporte.banco}</p>
          <p><strong>ID Factura:</strong> {reporte.factura_id}</p>

          <button class="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Validar Pago
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No hay reportes pendientes de validación.</p>
  {/if}
</section>

<section>
  <h1>Historial de Recibos</h1>
  {#if historialRecibos.length > 0}
    <ul>
      {#each historialRecibos as recibo}
        <li class="mb-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <p><strong>Cliente ID:</strong> {recibo.cliente_id}</p>
          <p><strong>Monto:</strong> {recibo.monto} USD</p>
          <p><strong>Método de Pago:</strong> {recibo.metodo_pago}</p>
          <p><strong>Fecha:</strong> {new Date(recibo.fecha).toLocaleDateString()}</p>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No hay recibos en el historial.</p>
  {/if}
</section>

<section>
  <button on:click={imprimirRecibos} class="bg-green-500 text-white px-4 py-2 rounded">
    Imprimir todos los recibos del día
  </button>
</section>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
  }
  button {
    background-color: #4caf50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
  }
</style>
