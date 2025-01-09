<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Reporte {
    id: number;
    cliente_id: number;
    monto: number;
    referencia_pago: string;
    metodo_pago: string;
    banco: string; // Banco emisor
    factura_id: number;
    telefono: number;
  }

  let reportesPendientes: Reporte[] = [];
  let errorMessage: string = '';
  let sonidoActivo: boolean = false;
  let sonidoHabilitado: boolean = false;
  let notificationSound: HTMLAudioElement;
  let intervaloAutoRefresh: number;

  // Cargar el sonido de notificación
  onMount(() => {
    notificationSound = new Audio('/sounds/notification.mp3');
    notificationSound.loop = true;

    // Capturar el primer clic del usuario para habilitar el sonido
    document.addEventListener('click', habilitarSonido, { once: true });

    // Iniciar la verificación automática cada 30 segundos
    fetchReportesPendientes();
    intervaloAutoRefresh = setInterval(fetchReportesPendientes, 30000); // 30 segundos
  });

  // Limpiar el intervalo cuando se destruye el componente
  onDestroy(() => {
    clearInterval(intervaloAutoRefresh);
  });

  // Habilitar el sonido cuando el usuario interactúa
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

  // Obtener reportes pendientes
  const fetchReportesPendientes = async () => {
    try {
      const response = await fetch('/api/pagos/reportes');
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

  // Validar el pago y detener el sonido
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

<!-- Mostrar la lista de reportes pendientes de validación -->
<section>
  <h1>Reportes Pendientes de Validación</h1>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  {#if reportesPendientes.length > 0}
    <ul>
      {#each reportesPendientes as reporte}
        <li class="mb-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <p><strong>Cliente ID:</strong> {reporte.cliente_id}</p>
          <p><strong>Monto:</strong> {reporte.monto} USD</p>
          <p><strong>Número de Teléfono:</strong> {reporte.telefono}</p>
          <p><strong>Referencia de Pago:</strong> {reporte.referencia_pago}</p>
          <p><strong>Banco Emisor:</strong> {reporte.banco}</p>
          <p><strong>ID Factura:</strong> {reporte.factura_id}</p>

          <button 
            on:click={() => validarPago(reporte.id)}
            class="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Validar Pago
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No hay reportes pendientes de validación.</p>
  {/if}
</section>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
  }
  button {
    background-color: #4caf50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
</style>
