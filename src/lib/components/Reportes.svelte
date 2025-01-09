<script lang="ts">
  import { onMount } from 'svelte';

  interface Reporte {
    fecha: string;
    descripcion: string;
    monto: number | null; // Asegurarse de que monto puede ser un número o nulo
  }

  let reportes: Reporte[] = [];
  let errorMessage = '';

  // Función para obtener los reportes
  const fetchReportes = async () => {
    try {
      const response = await fetch('/api/cajeros/reportes'); // Ruta corregida para reportes de cajeros
      const data = await response.json();

      console.log('Datos recibidos de reportes:', data); // Depuración: Verifica la respuesta del servidor

      if (response.ok && data.success) {
        reportes = data.reportes || [];
        if (reportes.length === 0) {
          errorMessage = 'No hay reportes disponibles.';
        }
      } else {
        errorMessage = data.message || 'Error al obtener los reportes.';
      }
    } catch (error) {
      errorMessage = 'Error al conectar con el servidor para obtener los reportes.';
      console.error('Error al obtener los reportes:', error); // Depuración
    }
  };

  // Ejecutar la función al montar el componente
  onMount(() => {
    fetchReportes();
  });
</script>

<section>
  <h2 class="text-xl font-bold mb-4">Reportes</h2>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  {#if reportes.length > 0}
    <ul class="divide-y divide-gray-300">
      {#each reportes as reporte}
        <li class="py-2">
          <p><strong>Fecha:</strong> {new Date(reporte.fecha).toLocaleString()}</p>
          <p><strong>Descripción:</strong> {reporte.descripcion}</p>
          <p><strong>Monto:</strong> {typeof reporte.monto === 'number' ? reporte.monto.toFixed(2) : 'Monto no disponible'} Bs</p>
        </li>
      {/each}
    </ul>
  {:else if !errorMessage}
    <p>No hay reportes disponibles en este momento.</p>
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
