<script lang="ts">
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import Pagos from './Pagos.svelte';
  import Historial from './Historial.svelte';
  import Recibos from './Recibos.svelte';
  import Reportes from './Reportes.svelte';
  
  let activeSection = 'historial';
  let usuario = 'Usuario de ejemplo'; // Simular usuario desde la sesión

  let pdfUrl: string | null = null;
  let loading: boolean = false;
  let errorMessage: string = '';
  let successMessage: string = '';

  // Cambiar la sección activa cuando el usuario selecciona una opción
  const changeSection = (section: string) => {
    activeSection = section;
  };

  // Función para generar el reporte diario
  const generateDailyReport = async () => {
    try {
      loading = true;
      errorMessage = '';
      successMessage = '';

      const response = await fetch('/api/generar-reporte');
      const result = await response.json();

      if (result.success) {
        successMessage = 'Reporte generado correctamente.';
        pdfUrl = result.pdfUrl; // Guardar el enlace del PDF
      } else {
        errorMessage = result.message || 'Error al generar el reporte.';
      }
    } catch (error) {
      errorMessage = 'Hubo un error al generar el reporte.';
      console.error('Error al generar el reporte:', error);
    } finally {
      loading = false;
    }
  };

  // Cargar la sección de historial por defecto al montar el componente
  onMount(() => {
    changeSection('historial');
  });
</script>

<!-- Encabezado con el nombre del usuario y control de navegación -->
<Header {usuario} {changeSection} />

<!-- Contenido dinámico basado en la sección activa -->
<section>
  {#if activeSection === 'pagos'}
    <Pagos />
  {:else if activeSection === 'historial'}
    <Historial />
  {:else if activeSection === 'recibos'}
    <Recibos />
  {:else if activeSection === 'reportes'}
    <Reportes />
  {/if}
</section>

<!-- Sección para generar reporte diario -->
<section>
  <h2 class="text-xl font-bold mb-4">Dashboard - Generar Reporte Diario</h2>

  <!-- Mostrar mensajes de éxito o error -->
  {#if successMessage}
    <p class="text-green-500">{successMessage}</p>
  {/if}

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  <!-- Botón para generar el reporte -->
  <button on:click={generateDailyReport} disabled={loading} class="btn btn-primary">
    {#if loading}
      Generando Reporte...
    {:else}
      Generar Reporte Diario
    {/if}
  </button>

  <!-- Mostrar el enlace al PDF si el reporte fue generado -->
  {#if pdfUrl}
    <p class="mt-4">
      <a href={pdfUrl} target="_blank" class="text-blue-500 underline">Descargar Reporte Diario</a>
    </p>
  {/if}
</section>

<style>
  section {
    padding: 1rem;
    max-width: 800px;
    margin: auto;
  }
  
  .btn {
    padding: 10px 15px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .btn:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }

  .text-red-500 {
    color: #f87171;
  }

  .text-green-500 {
    color: #34d399;
  }

  .text-blue-500 {
    color: #3b82f6;
  }

  .underline {
    text-decoration: underline;
  }

  .mt-4 {
    margin-top: 1rem;
  }
</style>
