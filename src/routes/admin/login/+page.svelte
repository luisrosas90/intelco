<!-- src/routes/admin/login/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  let email: string = '';
  let password: string = '';
  let errorMessage: string = '';

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Redirigir al dashboard del administrador
        goto('/admin/dashboard');
      } else {
        errorMessage = data.message;
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      errorMessage = 'Hubo un error al procesar la solicitud. Inténtalo de nuevo.';
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div>
    <label for="email">Correo electrónico:</label>
    <input type="email" id="email" bind:value={email} required />
  </div>

  <div>
    <label for="password">Contraseña:</label>
    <input type="password" id="password" bind:value={password} required />
  </div>

  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}

  <button type="submit">Iniciar sesión</button>
</form>

<style>
  form {
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  div {
    margin-bottom: 1rem;
  }

  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input {
    padding: 0.5rem;
    font-size: 1rem;
  }

  button {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
