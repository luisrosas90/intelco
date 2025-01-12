
<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import Swal from 'sweetalert2';
  import { invalidateAll, goto } from '$app/navigation'; // Importar goto

  let cedula: string = '';
  let clientData: any = null;
  let valor: number | null = null;
  let idFactura: number | null = null;
  let valorConverted: string | null = null;
  let valorConvertedWithTax: string | null = null;
  let exchangeRate: number = 0;
  let showReportButton = false;
  let referenceNumber: string = '';
  let selectedBank: string = '';
  let phoneNumber: string = '';
  let showClientData = false;
  let isSubmitting = false;
  let message = ''; // <--- Declarar la variable message

  const searchClient = async () => {
    try {
        const response = await fetch('/api/consultar-cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cedula })
        });

        const { client, debt } = await response.json();

        if (client) {
            if (debt.length > 0 && client.facturacion.facturas_nopagadas > 0) {
                // Verificar si la factura ya fue reportada
                const facturaId = debt[0]?.IDFactura;
                const facturaResponse = await fetch(`/api/reportes?facturaId=${facturaId}`);
                const facturaData = await facturaResponse.json();

                if (facturaData.reportada) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Información',
                        text: 'Esta factura ya ha sido reportada. Gracias por su paciencia.',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            invalidateAll(); // Recargar la página
              }
            });
            return; // No continuar con el rellenado del formulario
          }

          // Si la factura no ha sido reportada, continuar con el rellenado del formulario
          clientData = client;
          showClientData = true;
          valor = debt[0]?.valor || null;
          idFactura = debt[0]?.IDFactura || null;

          const rateResponse = await fetch('/api/exchange-rate');
          const { exchangeRate: rate } = await rateResponse.json();
          exchangeRate = rate;

          valorConverted = valor ? (valor * exchangeRate).toFixed(2) : null;

          const tax = 0.16; // 16% impuesto
          valorConvertedWithTax = valorConverted
            ? (parseFloat(valorConverted) * (1 + tax)).toFixed(2)
            : null;

          showReportButton = true;
          message = '';
        } else {
          Swal.fire({ // Alerta para cliente solvente
            icon: 'info',
            title: 'Información',
            text: 'Usted se encuentra solvente. Gracias por preferirnos.',
          });
          showReportButton = false;
        }
      } else {
        Swal.fire({ // Alerta para cliente no encontrado
          icon: 'warning',
          title: 'Advertencia',
          text: 'No se encontró el cliente o no tiene facturas pendientes de pago.',
        });
        showClientData = false;
        showReportButton = false;
      }
    } catch (error) {
      console.error('Error al consultar el cliente:', error);
      Swal.fire({ // Alerta para error en la consulta
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al consultar la información del cliente.',
      });
      showClientData = false;
    }
  };

  const submitPayment = async () => {
        if (isSubmitting) return;
        isSubmitting = true;

        if (!idFactura || !valor || !referenceNumber || !selectedBank || !phoneNumber) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios.',
            });
            isSubmitting = false;
            return;
        }

        const paymentData = {
            clienteId: clientData.id,
            nombreCliente: clientData.nombre,
            montoEnUsd: valor,
            facturaId: idFactura,
            selectedMethod: 'Pago Móvil',
            referenceNumber: referenceNumber,
            banco: selectedBank,
            telefono: phoneNumber,
        };

        try {
            const response = await fetch('/api/reportes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });
            console.log('Respuesta del servidor:', response);

            if (response.ok) {
        const responseData = await response.json();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: responseData.message,
        }).then(() => {
          goto('/web'); // Redirigir a /web
        });
      } else if (response.status === 409) {
        const responseData = await response.json();
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: responseData.message,
        }).then(() => {
          goto('/web2'); // Redirigir a /web2
        });
      } else {
        const responseData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: responseData.message || 'Error al procesar el reporte de pago.',
        });
      }
    } catch (error) {
      console.error('Error al enviar el reporte de pago:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al enviar el reporte de pago. Por favor, intente de nuevo.',
      });
    } finally {
      isSubmitting = false;
    }
  };
  onMount(() => {
    // ...
  });
</script>

<section class="container mx-auto p-4">
  <div class="flex justify-center mb-8">
      <img src="/logo.png" alt="Logo" class="w-32 h-auto" />
  </div>
</section>

<section class="container mx-auto p-4">
  <form id="searchForm" on:submit|preventDefault={searchClient} class="space-y-4">
      <label for="cedula" class="block text-gray-700">CONSULTAR DEUDA</label>
      <input id="cedula" bind:value={cedula} required class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button type="submit" class="w-full bg-[#1e8ddf] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#1b76d2] focus:outline-none focus:ring-2 focus:ring-blue-500">
          Buscar
      </button>
  </form>
</section>

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
              <p class="text-gray-600">Deuda Total con 16% de Impuesto (Bs): {valorConvertedWithTax} Bs</p>
              <div class="bg-gray-100 p-4 border border-gray-300 rounded-md shadow-sm">
                  <p class="text-gray-700">Datos del Pago Móvil</p>
                  <button type="button" on:click={() => navigator.clipboard.writeText('405941618')} class="block text-blue-600 hover:underline mb-2">
                      Rif: J40594161-8
                  </button>
                  <button type="button" on:click={() => navigator.clipboard.writeText('04125180594')} class="block text-blue-600 hover:underline mb-2">
                      Teléfono: 0412-5180594(BARINAS)
                  </button>
                  <p class="text-gray-700">Banco Provincial (0108)</p>
                  <p class="text-gray-700">CORPORACIÓN INTELCO 2012, C.A</p>
                  <p class="text-gray-700">Importante: Realizar el pago móvil por el monto que le indica el sistema.</p>
              </div>

              <h3 class="text-lg font-semibold text-gray-800">Reportar Pago</h3>
              <form on:submit|preventDefault={submitPayment} class="space-y-4">
                  <label for="referenceNumber" class="block text-gray-700">Número de Referencia</label>
                  <input
                   id="referenceNumber"
                   bind:value={referenceNumber}
                   required
                   class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label for="banco" class="block text-gray-700">Banco Emisor</label>
                  <select
                   id="banco"
                   bind:value={selectedBank}
                   required
                   class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      <option value="" disabled selected>Selecciona el Banco de desde donde se realiza el pago</option>
                      <option value="0102">(0102) - Banco de Venezuela</option>
                      <option value="0104">(0104) - Banco Venezolano de Crédito</option>
                      <option value="0105">(0105) - Banco Mercantil</option>
                      <option value="0108">(0108) - BBVA Banco Provincial</option>
                      <option value="0114">(0114) - BanCaribe</option>
                      <option value="0115">(0115) - Banco Exterior</option>
                      <option value="0128">(0128) - Banco Caroní</option>
                      <option value="0134">(0134) - Banesco</option>
                      <option value="0137">(0137) - Banco Sofitasa</option>
                      <option value="0138">(0138) - Banco Plaza</option>
                      <option value="0151">(0151) - Banco Fondo Común (BFC)</option>
                      <option value="0156">(0156) - 100% Banco</option>
                      <option value="0157">(0157) - Del Sur</option>
                      <option value="0163">(0163) - Banco del Tesoro</option>
                      <option value="0166">(0166) - Banco Agrícola de Venezuela</option>
                      <option value="0168">(0168) - BanCrecer, Banco de Desarrolo</option>
                      <option value="0169">(0169) - Mi banco, Banco Microfinanciero, C.A.</option>
                      <option value="0171">(0171) - Banco Activo</option>
                      <option value="0172">(0172) - Bancamiga Banco Universal, C.A.</option>
                      <option value="0174">(0174) - BanPlus, Banco Comercial</option>
                      <option value="0175">
                          (0175) - Banco Bicentenario, del Pueblo, de la Clase Obrera, Mujer y Comunas, Banco Universal, C.A.
                      </option>
                      <option value="0177">(0177) - Banco de las Fuerzas Armadas</option>
                      <option value="0178">(0178) - N58 Banco Digital, Banco Microfinanciero, S.A.</option>
                      <option value="0191">(0191) - Banco Nacional de Crédito, C.A. Banco Universal</option>
                      </select>

                  <label for="phoneNumber" class="block text-gray-700">Número de Teléfono desde donde se realiza el pago</label>
                  <input
                   id="phoneNumber"
                   bind:value={phoneNumber}
                   required
                   class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label for="monto" class="block text-gray-700">Monto a Pagar (Bs)</label>
                  <input
                   id="monto"
                   value={valorConvertedWithTax}
                   readonly
                   class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
                  />

                  <button
                  type="submit"
                  disabled={isSubmitting}
                  class="w-full bg-[#fd9901] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#e89a01] focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                  {isSubmitting ? 'Enviando...' : 'Reportar mi Pago'}
              </button>
              </form>
          </div>
      {/if}
  </section>
{/if}

{#if message}
  <section class="container mx-auto p-4">
      <p class="text-center text-lg font-semibold text-green-600">{message}</p>
  </section>
{/if}

<style>
  /* Elimina estilos que sobrescriben los de Tailwind CSS */
</style>


