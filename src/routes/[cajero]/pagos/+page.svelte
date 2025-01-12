<script lang="ts">
  import ClienteInfo from './ClienteInfo.svelte';
  import ReportarPagoForm from './ReportarPagoForm.svelte';
  import type { ClientData, DebtData } from '$lib/types';
  import { onMount } from 'svelte';

  let cedula: string = '';
  let clientData: ClientData | null = null;
  let debtData: DebtData[] = [];
  let showReportButton: boolean = false;
  let showRegisterMessage = false;
  let errorMessage: string = '';
  let valor: number | null = null; // Monto en USD
  let valorConverted: string | null = null; // Monto en BS
  let idFactura: number | null = null; // ID de la factura
  let exchangeRate: number = 0; // Inicializar con un valor por defecto o 0
  let idCajero: number | null = null;

    // Utilizar onMount para asignar el valor de userId a idCajero cuando el componente se monte


  onMount(async () => {
    try {
      const response = await fetch('/api/exchange-rate');
      const data = await response.json();
      if (response.ok && data.exchangeRate) {
        exchangeRate = data.exchangeRate;
        console.log("Tasa de cambio obtenida:", exchangeRate);
      } else {
        console.error("Error al obtener la tasa de cambio:", data.message);
        // Manejar el error, por ejemplo, mostrando un mensaje al usuario o usando una tasa de cambio por defecto
      }
    } catch (error) {
      console.error("Error al obtener la tasa de cambio:", error);
      // Manejar el error
    }
  });

  const fetchClientAndDebtData = async () => {
    if (!cedula) {
      alert('Debe ingresar una cédula para buscar.');
      return;
    }

    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula })
      });

      const data = await response.json();
      console.log('Datos recibidos del cliente:', data);

      if (response.ok) {
        clientData = data.client;
        debtData = data.debt;

        if (clientData) {
          if (clientData.facturacion.facturas_nopagadas > 0) {
            valor = debtData[0]?.valor || null;
            idFactura = debtData[0]?.IDFactura || null;
            valorConverted = valor ? (valor * exchangeRate).toFixed(2) : null;

            console.log('Valor en USD:', valor);
            console.log('Valor en BS:', valorConverted);
            console.log('ID de la factura:', idFactura);

            showReportButton = true;
          } else {
            alert('El cliente no tiene deudas.');
            showReportButton = false;
          }
        } else {
          showRegisterMessage = true;
          showReportButton = false;
        }

        if (debtData.length === 0) {
          alert('No se encontraron datos de deuda.');
        }
      } else {
        errorMessage = data.mensaje;
        console.error('Error en la respuesta de la API:', errorMessage);
      }
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
    }
  };
</script>

<section>
  <h2 class="text-xl font-bold mb-4">Pagos</h2>
  <section class="w-full max-w-md px-5 py-6 mx-auto bg-white rounded-md shadow-md">
    <div class="flex flex-col items-center">
      <form id="searchForm" on:submit|preventDefault={fetchClientAndDebtData} class="w-full">
        <label for="cedula" class="block text-lg font-medium text-gray-700 text-center mb-2">Cédula del Cliente</label>
        <input
          id="cedula"
          bind:value={cedula}
          required
          class="w-full py-3 pl-4 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          class="flex items-center justify-center w-full px-4 py-2 mt-4 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none"
        >
          Buscar Cliente
        </button>
      </form>
    </div>
  </section>

  {#if clientData}
    <ClienteInfo {clientData} />

    {#if showReportButton && valorConverted && idFactura}
      <ReportarPagoForm
        bind:valorEnBs={valorConverted}
        montoEnUsd={valor}
        clienteId={clientData.id}
        nombreCliente={clientData.nombre}
        facturaId={idFactura}
        bind:cedula={cedula}
        idCajero={idCajero}
      />
    {/if}
  {/if}

  {#if showRegisterMessage}
    <p class="mt-4 text-center text-red-600 font-medium">Cliente no encontrado. ¡Regístrate con nosotros!</p>
  {/if}

  {#if errorMessage}
    <p class="mt-4 text-center text-red-600 font-medium">{errorMessage}</p>
  {/if}
</section>