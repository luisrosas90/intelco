<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let totalClientes = 0;
  let totalReportesPendientes = 0;
  let totalCajeros = 0;
  let cajerosData = []; // Aquí almacenaremos la información de los cajeros
  let errorMessage = '';

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (response.ok && data.success) {
        totalClientes = data.totalClientes;
        totalReportesPendientes = data.totalReportesPendientes;
        totalCajeros = data.totalCajeros;
        cajerosData = data.cajeros; // Asignamos los datos de los cajeros
      } else {
        errorMessage = data.message || 'Error al obtener los datos.';
      }
    } catch (error) {
      errorMessage = 'Error al conectar con la API.';
      console.error('Error fetching dashboard data:', error);
    }
  };

  onMount(fetchDashboardData);

  const logout = async () => {
    const response = await fetch('/api/admin/logout', { method: 'POST' });

    if (response.ok) {
      window.location.href = '/admin/login';
    } else {
      alert('Error al cerrar sesión');
    }
  };
</script>

<section class="dashboard">
  <h1 class="text-3xl font-bold mb-6">Panel de Administración</h1>
  
  <button on:click={logout} class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">
    Cerrar Sesión
  </button>

  {#if errorMessage}
    <p class="text-red-600">{errorMessage}</p>
  {/if}

  <div class="stats-grid">
    <div class="stat-item">
      <h2>Total de Clientes</h2>
      <p>{totalClientes}</p>
    </div>

    <div class="stat-item">
      <h2>Reportes Pendientes</h2>
      <p>{totalReportesPendientes}</p>
    </div>

    <div class="stat-item">
      <h2>Total de Cajeros</h2>
      <p>{totalCajeros}</p>
    </div>
  </div>

  <!-- Nueva sección para la información de los cajeros -->
  <section class="cajeros-section mt-6">
    <h2 class="text-2xl font-bold mb-4">Información de Cajeros</h2>

    {#if cajerosData.length > 0}
      <table class="cajeros-table w-full bg-white border-collapse border border-gray-300">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 p-2">Cajero</th>
            <th class="border border-gray-300 p-2">Saldo Actual</th>
            <th class="border border-gray-300 p-2">Ingresos Totales</th>
            <th class="border border-gray-300 p-2">Egresos Totales</th>
            <th class="border border-gray-300 p-2">Última Operación</th>
          </tr>
        </thead>
        <tbody>
          {#each cajerosData as cajero}
            <tr>
              <td class="border border-gray-300 p-2">{cajero.nombre}</td>
              <td class="border border-gray-300 p-2">{cajero.saldoActual}</td>
              <td class="border border-gray-300 p-2">{cajero.ingresosTotales}</td>
              <td class="border border-gray-300 p-2">{cajero.egresosTotales}</td>
              <td class="border border-gray-300 p-2">{cajero.ultimaOperacion}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>No se encontró información de cajeros.</p>
    {/if}
  </section>
</section>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  .stat-item {
    background-color: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  .stat-item h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .cajeros-section {
    margin-top: 2rem;
  }
  .cajeros-table {
    width: 100%;
    border-collapse: collapse;
  }
  .cajeros-table th, .cajeros-table td {
    border: 1px solid #ccc;
    padding: 0.75rem;
    text-align: left;
  }
  .cajeros-table th {
    background-color: #f9f9f9;
  }
</style>
