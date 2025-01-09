<script lang="ts">
  import { onMount } from 'svelte';

  let cedula: string = '';
  let clientData: any = null;
  let valor: number | null = null;
  let idFactura: number | null = null;
  let valorConverted: string | null = null;
  let exchangeRate: number = 0;
  let showReportButton = false;
  let referenceNumber: string = '';
  let selectedBank: string = '';
  let phoneNumber: string = ''; // Asegúrate de capturar el número de teléfono
  let message = '';
  let showClientData = false;

  const searchClient = async () => {
    try {
      const response = await fetch('/api/consultar-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula })
      });

      const { client, debt } = await response.json();

      if (client) {
        clientData = client;
        showClientData = true;

        if (debt.length > 0 && client.facturacion.facturas_nopagadas > 0) {
          valor = debt[0]?.valor || null;
          idFactura = debt[0]?.IDFactura || null;

          const rateResponse = await fetch('/api/exchange-rate');
          const { exchangeRate: rate } = await rateResponse.json();
          exchangeRate = rate;

          valorConverted = valor ? (valor * exchangeRate).toFixed(2) : null;
          showReportButton = true;
          message = ''; // Limpiar mensaje si hay deuda
        } else {
          message = 'Usted se encuentra solvente. Gracias por preferirnos.';
          showReportButton = false;
        }
      } else {
        message = 'No se encontró el cliente.';
        showClientData = false;
        showReportButton = false;
      }
    } catch (error) {
      console.error('Error al consultar el cliente:', error);
      message = 'Hubo un error al consultar la información del cliente.';
      showClientData = false;
    }
  };

  const submitPayment = async () => {
    if (!idFactura || !valor || !referenceNumber || !selectedBank || !phoneNumber) {
      message = 'Todos los campos son obligatorios.';
      return;
    }

    const paymentData = {
      clienteId: clientData.id,
      nombreCliente: clientData.nombre,
      montoEnUsd: valor,
      facturaId: idFactura,
      selectedMethod: 'Pago Móvil',
      referenceNumber,
      banco: selectedBank,
      telefono: phoneNumber
    };

    const response = await fetch('/api/pagos/reportes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });

    if (response.ok) {
      message = 'Su pago está siendo validado. ¡Gracias por preferirnos!';
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      message = 'Error al reportar el pago. Intente nuevamente.';
    }
  };

  onMount(() => {
    cedula = '65454323'; // Valor predeterminado para pruebas
  });
</script>

<!-- Formulario para buscar al cliente -->
<section class="container mx-auto p-4">
  <form id="searchForm" on:submit|preventDefault={searchClient} class="space-y-4">
    <label for="cedula" class="block text-gray-700">Cédula del Cliente</label>
    <input id="cedula" bind:value={cedula} required class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
    <button type="submit" class="w-full bg-[#1e8ddf] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#1b76d2] focus:outline-none focus:ring-2 focus:ring-blue-500">Buscar Cliente</button>
  </form>
</section>

<!-- Información del cliente y reporte de pago -->
{#if showClientData}
  <section class="container mx-auto p-4 space-y-4">
    <h3 class="text-xl font-semibold text-gray-800">Información del Cliente</h3>
    <p class="text-gray-600">Nombre: {clientData.nombre}</p>
    <p class="text-gray-600">Dirección: {clientData.direccion_principal}</p>

    {#if showReportButton}
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-800">Deuda</h3>
        <p class="text-gray-600">Deuda Total (USD): ${valor}</p>
        <p class="text-gray-600">Deuda Total (Bs): {valorConverted} Bs</p>

        <div class="bg-gray-100 p-4 border border-gray-300 rounded-md shadow-sm">
          <button type="button" on:click={() => navigator.clipboard.writeText('J40594161-8')} class="block text-blue-600 hover:underline mb-2">Rif: J40594161-8</button>
          <button type="button" on:click={() => navigator.clipboard.writeText('04245979718')} class="block text-blue-600 hover:underline mb-2">Teléfono: 04245979718 (BARINAS)</button>
          <p class="text-gray-700">Banco Provincial (0108)</p>
          <p class="text-gray-700">CORPORACIÓN INTELCO 2012, C.A</p>
          <p class="text-gray-700">Importante: Realizar el pago móvil por el monto que le indica el sistema.</p>
        </div>

        <h3 class="text-lg font-semibold text-gray-800">Reportar Pago</h3>
        <form on:submit|preventDefault={submitPayment} class="space-y-4">
          <label for="referenceNumber" class="block text-gray-700">Número de Referencia</label>
          <input id="referenceNumber" bind:value={referenceNumber} required class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

          <label for="banco" class="block text-gray-700">Selecciona el Banco</label>
          <select id="banco" bind:value={selectedBank} required class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled selected>Selecciona un Banco</option>
            <!-- Opciones de bancos... -->
            <option value="0102">
              (0102) - Banco de Venezuela
           </option>
           <option value="0104">
              (0104) - Banco Venezolano de Crédito
           </option>
           <option value="0105">
              (0105) - Banco Mercantil
           </option>
           <option value="0108">
              (0108) - BBVA Banco Provincial
           </option>
           <option value="0114">
              (0114) - BanCaribe
           </option>
           <option value="0115">
              (0115) - Banco Exterior
           </option>
           <option value="0128">
              (0128) - Banco Caroní
           </option>
           <option value="0134">
              (0134) - Banesco
           </option>
           <option value="0137">
              (0137) - Banco Sofitasa
           </option>
           <option value="0138">
              (0138) - Banco Plaza
           </option>
           <option value="0151">
              (0151) - Banco Fondo Común (BFC)
           </option>
           <option value="0156">
              (0156) - 100% Banco
           </option>
           <option value="0157">
              (0157) - Del Sur
           </option>
           <option value="0163">
              (0163) - Banco del Tesoro
           </option>
           <option value="0166">
              (0166) - Banco Agrícola de Venezuela
           </option>
           <option value="0168">
              (0168) - BanCrecer, Banco de Desarrolo
           </option>
           <option value="0169">
              (0169) - Mi banco, Banco Microfinanciero, C.A.
           </option>
           <option value="0171">
              (0171) - Banco Activo
           </option>
           <option value="0172">
              (0172) - Bancamiga Banco Universal, C.A.
           </option>
           <option value="0174">
              (0174) - BanPlus, Banco Comercial
           </option>
           <option value="0175">
              (0175) - Banco Bicentenario, del Pueblo, de la Clase Obrera, Mujer y Comunas, Banco Universal, C.A.
           </option>
           <option value="0177">
              (0177) - Banco de las Fuerzas Armadas
           </option>
           <option value="0178">
              (0178) - N58 Banco Digital, Banco Microfinanciero, S.A.
           </option>
           <option value="0191">
              (0191) - Banco Nacional de Crédito, C.A. Banco Universal
           </option>
            <!-- Agrega las demás opciones aquí -->
          </select>

          <label for="phoneNumber" class="block text-gray-700">Número de Teléfono</label>
          <input id="phoneNumber" bind:value={phoneNumber} required class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

          <label for="monto" class="block text-gray-700">Monto a Pagar (Bs)</label>
          <input id="monto" value={valorConverted} readonly class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed">

          <button type="submit" class="w-full bg-[#fd9901] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#e89a01] focus:outline-none focus:ring-2 focus:ring-orange-500">Reportar Pago</button>
        </form>
      </div>
    {/if}
  </section>
{/if}

<!-- Mensaje de estado -->
{#if message}
  <section class="container mx-auto p-4">
    <p class="text-center text-lg font-semibold text-green-600">{message}</p>
  </section>
{/if}

<style>
  /* Elimina estilos que sobrescriben los de Tailwind CSS */
</style>
