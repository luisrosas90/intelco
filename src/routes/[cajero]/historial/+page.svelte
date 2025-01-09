<script lang="ts">
  import { onMount } from 'svelte';

  interface Historial {
    id: number;
    cliente_id: number;
    monto: number;
    metodo_pago: string;
    fecha: string;
    factura_id: number;
    referencia_pago: string;
    banco: string;
    telefono: string;
  }

  let historial: Historial[] = [];
  let errorMessage: string = '';
  let successMessage: string = '';
  let filterByClientId: string = '';
  let filterByDate: string = '';

  // Función para obtener el historial de transacciones
  const fetchHistorial = async () => {
    try {
      const response = await fetch('/api/cajeros/historial');
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.recibos && data.recibos.length > 0) {
          historial = data.recibos;
          successMessage = 'Historial cargado correctamente.';
        } else {
          successMessage = 'No hay transacciones en el historial.';
        }
      } else {
        errorMessage = data.message || 'Error al obtener el historial de pagos.';
      }
    } catch (error) {
      errorMessage = 'Error al conectar con la API del historial de pagos.';
      console.error('Error al obtener historial:', error);
    }
  };

  // Filtrar historial por cliente
  const filterHistorialByClient = () => {
    if (!filterByClientId) return historial;
    return historial.filter((transaccion) => 
      transaccion.cliente_id.toString().includes(filterByClientId)
    );
  };

  // Filtrar historial por fecha
  const filterHistorialByDate = () => {
    if (!filterByDate) return historial;
    return historial.filter((transaccion) => 
      transaccion.fecha.includes(filterByDate)
    );
  };

  // Obtener el historial al montar el componente
  onMount(() => {
    fetchHistorial();
  });
</script>

<section>
  <h1>Historial de Transacciones</h1>

  {#if successMessage}
    <p class="text-green-500">{successMessage}</p>
  {/if}

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  <!-- Filtro por Cliente -->
  <div class="filter">
    <label for="clientIdFilter">Filtrar por Cliente ID:</label>
    <input
      type="text"
      id="clientIdFilter"
      bind:value={filterByClientId}
      placeholder="Ingrese Cliente ID"
      class="w-full py-2 px-4 border rounded-md"
    />
  </div>

  <!-- Filtro por Fecha -->
  <div class="filter">
    <label for="dateFilter">Filtrar por Fecha:</label>
    <input
      type="date"
      id="dateFilter"
      bind:value={filterByDate}
      class="w-full py-2 px-4 border rounded-md"
    />
  </div>

  {#if historial.length > 0}
    <ul>
      {#each (filterByClientId ? filterHistorialByClient() : filterByDate ? filterHistorialByDate() : historial) as transaccion}
        <li class="mb-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <p><strong>Cliente ID:</strong> {transaccion.cliente_id}</p>
          <p><strong>Monto:</strong> {transaccion.monto} USD</p>
          <p><strong>Método de Pago:</strong> {transaccion.metodo_pago}</p>
          <p><strong>Fecha:</strong> {new Date(transaccion.fecha).toLocaleDateString()}</p>
          <p><strong>Referencia de Pago:</strong> {transaccion.referencia_pago}</p>
          <p><strong>Banco Emisor:</strong> {transaccion.banco}</p>
          <p><strong>ID Factura:</strong> {transaccion.factura_id}</p>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No hay transacciones en el historial.</p>
  {/if}
</section>

<style>
  .filter {
    margin-bottom: 1rem;
  }
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
</style>
