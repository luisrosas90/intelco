<script lang="ts">
  import { onMount } from 'svelte';
  let pagosPendientes = [];

  const fetchPagosPendientes = async () => {
    try {
      const response = await fetch('/api/admin/pagos-pendientes'); // Cambié la URL para que coincida con tu API
      const data = await response.json();
      if (response.ok) {
        pagosPendientes = data.pagos;
      }
    } catch (error) {
      console.error('Error al obtener pagos pendientes:', error);
    }
  };

  const validarPago = async (idPago: number) => {
    try {
      const response = await fetch(`/api/admin/validar-pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idPago })
      });
      if (response.ok) {
        alert('Pago validado.');
        fetchPagosPendientes(); // Refrescar la lista
      } else {
        alert('Error al validar el pago.');
      }
    } catch (error) {
      alert('Error en la solicitud.');
    }
  };

  onMount(fetchPagosPendientes);
</script>

<section>
  <h2>Validar Pagos Pendientes</h2>
  <ul>
    {#if pagosPendientes.length > 0}
      {#each pagosPendientes as pago}
        <li>
          {pago.cliente} - {pago.monto} Bs
          <button on:click={() => validarPago(pago.id)}>Validar</button>
        </li>
      {/each}
    {:else}
      <p>No hay pagos pendientes.</p>
    {/if}
  </ul>
</section>
