<!-- /src/routes/admin/reportes-cajeros/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let reportesCajeros = [];

  const fetchReportesCajeros = async () => {
    const response = await fetch('/api/admin/reportes-cajeros');
    const data = await response.json();

    if (response.ok && data.success) {
      reportesCajeros = data.reportesCajeros;
    }
  };

  onMount(fetchReportesCajeros);
</script>

<section>
  <h1 class="text-3xl font-bold mb-6">Reportes de Cajeros</h1>

  <ul>
    {#each reportesCajeros as reporte}
      <li class="reporte-item">
        <p><strong>Cajero:</strong> {reporte.cajero_nombre}</p>
        <p><strong>Tipo:</strong> {reporte.tipo}</p>
        <p><strong>Fecha:</strong> {reporte.fecha}</p>
      </li> <!-- Aquí cerramos correctamente la etiqueta <li> -->
    {/each}
  </ul>
</section>

<style>
  .reporte-item {
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #f4f4f4;
    border-radius: 8px;
  }
</style>
