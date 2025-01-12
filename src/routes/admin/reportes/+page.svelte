<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Reporte {
    id: number;
    cliente_id: number;
    monto: number;
    monto_bs: number | null;
    referencia_pago: string;
    metodo_pago: string;
    banco: string;
    factura_id: number;
    telefono: string;
    created_at: string;
    nombre_cajero: string;
    estado: string;
    moneda: string
  }

  let reportesPendientes: Reporte[] = [];
  let errorMessage: string = '';
  let sonidoActivo: boolean = false;
  let sonidoHabilitado: boolean = false;
  let notificationSound: HTMLAudioElement;
  let intervaloAutoRefresh:  NodeJS.Timeout | number;

  onMount(() => {
    notificationSound = new Audio('/sounds/notification.mp3');
    notificationSound.loop = true;

    document.addEventListener('click', habilitarSonido, { once: true });

    fetchReportesPendientes();
    intervaloAutoRefresh = setInterval(fetchReportesPendientes, 30000);
  });

  onDestroy(() => {
    clearInterval(intervaloAutoRefresh);
  });

  const habilitarSonido = () => {
    sonidoHabilitado = true;
    reproducirNotificacion();
  };

  const reproducirNotificacion = () => {
    if (sonidoHabilitado && !sonidoActivo && notificationSound) {
      notificationSound.play().catch((error) => {
        console.error('Error al reproducir la notificación:', error);
      });
      sonidoActivo = true;
    }
  };

  const detenerNotificacion = () => {
    if (sonidoActivo && notificationSound) {
      notificationSound.pause();
      notificationSound.currentTime = 0;
      sonidoActivo = false;
    }
  };

  const fetchReportesPendientes = async () => {
    try {
      const response = await fetch('/api/admin/reportes', {
        method: 'GET',
      });
      const data = await response.json();

      if (response.ok && data.success) {
        reportesPendientes = data.reportes;

        if (reportesPendientes.length > 0) {
          reproducirNotificacion();
        } else {
          detenerNotificacion();
        }
      } else {
        errorMessage = data.message || 'Error al obtener los reportes pendientes.';
      }
    } catch (error) {
      errorMessage = 'Error al conectar con la API de reportes pendientes.';
      console.error('Error al obtener reportes pendientes:', error);
    }
  };

  const validarPago = async (reporteId: number) => {
    try {
      const response = await fetch(`/api/admin/validar-reporte`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporteId, accion: 'validar' })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        reportesPendientes = reportesPendientes.filter(r => r.id !== reporteId);
        alert('El pago ha sido validado correctamente.');

        if (reportesPendientes.length === 0) {
          detenerNotificacion();
        }
      } else {
        alert('Error al validar el pago: ' + data.message);
      }
    } catch (error) {
      console.error('Error al validar el pago:', error);
      alert('Hubo un error al validar el pago.');
    }
  };
</script>


<section class="p-6 bg-gray-100">
  <h1 class="text-2xl font-bold text-center mb-6">Reportes Pendientes de Validación</h1>

  {#if errorMessage}
      <p class="text-red-500 mb-4">{errorMessage}</p>
  {/if}

  <div class="flex flex-col gap-4">
      {#if reportesPendientes.length > 0}
          {#each reportesPendientes as reporte}
              <div class="bg-white p-4 rounded-lg shadow">
                  <p class="font-bold">ID: <span class="font-normal">{reporte.id}</span></p>
                  <p class="font-bold">Cliente ID: <span class="font-normal">{reporte.cliente_id}</span></p>
                  <p class="font-bold">Método de Pago: <span class="font-normal">{reporte.metodo_pago}</span></p>
                  <p class="font-bold">Monto (USD): <span class="font-normal">{reporte.monto}</span></p>
                  <p class="font-bold">Monto (Bs): <span class="font-normal">{reporte.monto_bs ? reporte.monto_bs + ' Bs' : 'N/A'}</span></p>
                  <p class="font-bold">Factura ID: <span class="font-normal">{reporte.factura_id}</span></p>
                  <p class="font-bold">Estado: <span class="font-normal">{reporte.estado}</span></p>
                  <p class="font-bold">Referencia: <span class="font-normal">{reporte.referencia_pago}</span></p>
                  <p class="font-bold">Moneda: <span class="font-normal">{reporte.moneda}</span></p>
                  <p class="font-bold">Teléfono: <span class="font-normal">{reporte.telefono}</span></p>
                  <p class="font-bold">Banco: <span class="font-normal">{reporte.banco}</span></p>
                  <p class="font-bold">Fecha y Hora: <span class="font-normal">{new Date(reporte.created_at).toLocaleString()}</span></p>
                  <p class="font-bold">Cajero: <span class="font-normal">{reporte.nombre_cajero}</span></p>
                  <button 
                      on:click={() => validarPago(reporte.id)}
                      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                      Validar Pago
                  </button>
              </div>
          {/each}
      {:else}
          <p class="text-center">No hay reportes pendientes de validación.</p>
      {/if}
  </div>
</section>

<style>
/* ... (elimina los estilos de la tabla) ... */

/* Estilos para las tarjetas */
.bg-white {
  background-color: #fff;
}

.p-4 {
  padding: 1rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.font-bold {
  font-weight: bold;
}

.font-normal {
  font-weight: normal;
}

/* Estilos para el botón */
.bg-blue-500 {
  background-color: #4299e1;
}

.text-white {
  color: #fff;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded {
  border-radius: 0.25rem;
}

.mt-4 {
  margin-top: 1rem;
}

.hover\:bg-blue-700:hover {
  background-color: #2b6cb0;
}
</style>