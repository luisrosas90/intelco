<script>
  let recibos = [];

  async function cargarRecibos(cedula) {
    const response = await fetch(`/api/recibos/${cedula}`);
    recibos = await response.json();
  }
</script>

<section>
  <h2>Recibos del Cliente</h2>
  <input type="text" placeholder="Cédula" on:input={(e) => cargarRecibos(e.target.value)} />
  <ul>
    {#each recibos as recibo}
      <li>{recibo.fecha}: {recibo.monto} - {recibo.status}</li>
    {/each}
  </ul>
</section>
