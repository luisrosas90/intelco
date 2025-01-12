<script lang="ts">
  import { AlertType } from '$lib/types'; // Importa el enum

  export let show: boolean = false;
  export let message: string = '';
  export let type: AlertType = AlertType.Info; // Usa el enum como tipo

  function getBgColor() {
      switch (type) {
          case AlertType.Success:
              return 'bg-green-100 border-green-400 text-green-700';
          case AlertType.Error:
              return 'bg-red-100 border-red-400 text-red-700';
          case AlertType.Warning:
              return 'bg-yellow-100 border-yellow-400 text-yellow-700';
          default:
              return 'bg-blue-100 border-blue-400 text-blue-700';
      }
  }
  
</script>

{#if show}
  <div class="p-4 mb-4 text-sm rounded-lg {getBgColor()}" role="alert">
      <span class="font-medium">{message}</span>
  </div>
{/if}