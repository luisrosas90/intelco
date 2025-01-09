<!-- /src/routes/admin/reportes-clientes/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
  
    let reportesPendientes = [];
  
    const fetchReportesClientes = async () => {
      const response = await fetch('/api/admin/reportes-clientes');
      const data = await response.json();
  
      if (response.ok && data.success) {
        reportesPendientes = data.reportes;
      }
    };
  
    const validarReporte = async (reporteId) => {
      const response = await fetch('/api/admin/validar-reporte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporteId, accion: 'verificar' }),
      });
  
      if (response.ok) {
        alert('Reporte validado exitosamente.');
        fetchReportesClientes();
      }
    };
  
    const rechazarReporte = async (reporteId) => {
      const response = await fetch('/api/admin/validar-reporte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporteId, accion: 'rechazar' }),
      });
  
      if (response.ok) {
        alert('Reporte rechazado.');
        fetchReportesClientes();
      }
    };
  
    onMount(fetchReportesClientes);
  </script>
  
  <section>
    <h1 class="text-2xl font-bold">Reportes Pendientes de Clientes</h1>
    <ul>
      {#each reportesPendientes as reporte}
        <li class="reporte-item">
          <p><strong>Cliente:</strong> {reporte.cliente_nombre}</p>
          <p><strong>Monto:</strong> {reporte.monto} Bs</p>
          <p><strong>Referencia:</strong> {reporte.referencia_pago}</p>
  
          <button on:click={() => validarReporte(reporte.id)} class="button-validar">Validar</button>
          <button on:click={() => rechazarReporte(reporte.id)} class="button-rechazar">Rechazar</button>
        </li>
      {/each}
    </ul>
  </section>
  
  <style>
    .reporte-item {
      background-color: white;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .button-validar {
      background-color: #28a745;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      margin-right: 1rem;
    }
    .button-rechazar {
      background-color: #dc3545;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 5px;
    }
  </style>
  