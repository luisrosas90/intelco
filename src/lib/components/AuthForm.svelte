<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    let usuario: string = '';
    let contraseña: string = '';
    let errorMessage: string = '';
  
    const dispatch = createEventDispatcher();
  
    const handleSubmit = async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ usuario, contraseña })
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          // Guarda el token en el almacenamiento local
          localStorage.setItem('authToken', data.authToken);
          dispatch('authSuccess');
        } else {
          errorMessage = data.message || 'Error de autenticación. Inténtalo de nuevo.';
        }
      } catch (error) {
        console.error('Error al autenticar:', error);
        errorMessage = 'Error de red. Por favor, inténtalo de nuevo más tarde.';
      }
    };
  </script>
  
  <div class="auth-form">
    <input type="text" placeholder="Usuario" bind:value={usuario} />
    <input type="password" placeholder="Contraseña" bind:value={contraseña} />
    <button on:click={handleSubmit}>Iniciar sesión</button>
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
  </div>
  
  <style>
    .auth-form {
      display: flex;
      flex-direction: column;
    }
  
    .error {
      color: red;
    }
  </style>
  