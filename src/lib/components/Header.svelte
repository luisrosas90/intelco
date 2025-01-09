<script lang="ts">
  export let usuario: string;
  export let changeSection: (section: string) => void;
</script>

<header>
  <h1>Bienvenido, {usuario}</h1>
  <nav>
    <button on:click={() => changeSection('pagos')}>Pagos</button>
    <button on:click={() => changeSection('historial')}>Historial</button>
    <button on:click={() => changeSection('recibos')}>Recibos</button>
    <button on:click={() => changeSection('reportes')}>Reportes</button>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #007bff;
    color: white;
    padding: 1rem;
    border-radius: 8px;
  }
  nav button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }
  nav button:hover {
    text-decoration: underline;
  }
</style>
