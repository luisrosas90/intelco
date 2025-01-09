<script lang="ts">
  import '../.././../app.css';
  export let data;
</script>

<!-- Layout principal con la navegación lateral y el contenido -->
<div class="flex h-screen bg-gray-100">
  
  <!-- Navegación lateral -->
  <aside class="w-64 bg-white p-6 shadow-md">
    <div class="text-center mb-8">
      <h2 class="text-xl font-bold text-green-500"><img src="/logo.png" alt="Logo" class="w-50 h-16" /></h2>
    </div>
 
    <div class="mt-auto flex items-center space-x-4">
      <img src="/favicon.png" alt="User" class="w-10 h-10 rounded-full" />
      <div>
        <!-- Mostrar el nombre del cajero autenticado -->
        {#if data && data.user}
          <p class="font-semibold text-gray-700">{data.user}</p>
          <p class="text-gray-400 text-sm">Cajero</p>
        {:else}
          <p class="font-semibold text-gray-700">Usuario no disponible</p>
        {/if}
      </div>
    </div>
  </aside>

  <!-- Sección de contenido principal -->
  <main class="flex-1 p-6 overflow-y-auto">
    <slot />
  </main>
</div>
