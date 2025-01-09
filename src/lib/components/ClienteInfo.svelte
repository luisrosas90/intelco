<!-- src/components/ClienteInfo.svelte -->
<script lang="ts">
    import type { ClientData } from '$lib/types';
    export let clientData: ClientData;
  
    let clientName: string = clientData.nombre;
    let clientAddress: string = clientData.direccion_principal;
    let phoneNumber: string = clientData.telefono;
  </script>
  
  <div class="mt-6 p-4 bg-white rounded-lg shadow-md">
    <h3 class="text-lg font-medium text-gray-800">Información del Cliente</h3>
    <p class="text-gray-700">Nombre: {clientName}</p>
    <p class="text-gray-700">Dirección: {clientAddress}</p>
    <p class="text-gray-700">Teléfono: {phoneNumber}</p>
    <p class="text-gray-700">Estado: {clientData.estado}</p>
    <p class="text-gray-700">Correo: {clientData.correo}</p>
    <h4 class="mt-4 font-semibold text-gray-800">Servicios:</h4>
    {#each clientData.servicios as servicio}
      <p class="text-gray-700">{servicio.tiposervicio} - {servicio.direccion} ({servicio.perfil})</p>
    {/each}
  </div>
  