<script lang="ts">
  import { jsPDF } from 'jspdf';

  export let valorEnBs: string | null = null;
  export let montoEnUsd: number | null = null;
  export let clienteId: number | null = null;
  export let nombreCliente: string = '';
  export let facturaId: number | null = null;
  export let cedula: string = '';  // Variable para la cédula del cliente
  export let idCajero: number | null = null;

  let selectedMethod: string = 'Pago Móvil'; // Valor por defecto
  let referenceNumber: string = ''; 
  let errorMessage: string = '';
  let successMessage: string = '';
  let selectedCurrency: string = 'USD'; // Moneda seleccionada, valor por defecto USD
  let banco: string = ''; // Banco debe estar seleccionado si no es efectivo
  let telefono: string = ''; // Número de teléfono debe ser proporcionado si no es efectivo

  // Variable para almacenar el valor en Bs con el 16% de impuesto
  let valorEnBsConImpuesto: string | null = null;

  // Calcular el valor con el 16% de impuesto
  const calcularImpuesto = () => {
    console.log("Calculando impuesto. Valor en Bs:", valorEnBs);
    if (valorEnBs) {
      const valorConImpuesto = parseFloat(valorEnBs) * 1.16;
      valorEnBsConImpuesto = valorConImpuesto.toFixed(2);
      console.log("Valor con impuesto:", valorEnBsConImpuesto);
    } else {
      valorEnBsConImpuesto = null;
    }
  };


  // Llamar a la función para calcular el impuesto cada vez que el valor en Bs cambie
  $: calcularImpuesto();

  // Validar los campos necesarios
  const validateFields = () => {
    if (!clienteId || !nombreCliente || !montoEnUsd || !facturaId || !cedula || !telefono) {
      errorMessage = 'Por favor, complete todos los campos obligatorios (incluyendo cédula y teléfono).';
      return false;
    }

    // Si el método de pago no es efectivo, validar referencia, banco y teléfono
    if (selectedMethod !== 'Efectivo' && (!referenceNumber || !banco || !telefono)) {
      errorMessage = 'El número de referencia, banco y teléfono son obligatorios para este método de pago.';
      return false;
    }

    return true;
  };

  // Enviar el pago al backend
  const submitPayment = async () => {
    if (!validateFields()) return;

    let url = selectedMethod === 'Efectivo' ? '/api/pagos/efectivo' : '/api/pagos/reportes';
    console.log("ID del cajero en ReportarPagoForm:", idCajero);
    const paymentData = {
      clienteId,
      nombreCliente,
      montoEnUsd,
      facturaId,
      selectedMethod,
      referenceNumber,
      banco,
      telefono,
      cedula,
      valorEnBs,
      valorEnBsConImpuesto,
      selectedCurrency,
      idCajero: idCajero,
      
    };

    // Verificar los datos antes de enviarlos
    console.log("Datos enviados a la API:", paymentData);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (response.ok) {
        successMessage = 'Su pago está siendo validado. Gracias por preferirnos.';
        errorMessage = '';

        // Generar recibo PDF y enviarlo al servidor
        await generateAndSaveReceipt();

        // Reiniciar el formulario después del éxito
        resetForm();
      } else {
        throw new Error(result.message || 'Error al procesar el pago.');
      }
    } catch (err: any) {
      errorMessage = `Error al procesar el pago: ${err.message || 'Error desconocido'}`;
    }
  };

  // Función para generar y guardar el recibo en PDF
  const generateAndSaveReceipt = async () => {
    if (!nombreCliente || !montoEnUsd || !facturaId) return;

    const doc = new jsPDF({
      unit: 'pt',
      format: [226.772, 841.89]
    });

    doc.setFontSize(18);
    const centerXLogo = (226.772 - 155) / 2;
    doc.addImage('/logo.png', 'PNG', centerXLogo, 20, 155, 65);
    doc.text('Recibo de Pago', 113.386, 90, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 100, 206.772, 100);
    doc.setFontSize(12);
    doc.text('Detalles del Cliente', 20, 120);
    doc.text(`Cliente: ${nombreCliente}`, 20, 140);
    doc.text(`Cédula: ${cedula}`, 20, 160);  // Incluir cédula en el recibo
    doc.text(`Teléfono: ${telefono}`, 20, 180);  // Incluir teléfono en el recibo
    doc.line(20, 210, 206.772, 210);
    doc.setFontSize(12);
    doc.text('Detalles del Pago', 20, 220);
    doc.text(`ID Factura: ${facturaId}`, 20, 235);
    doc.text(`Monto en USD: ${montoEnUsd}`, 20, 255);
    doc.text(`Monto en Bs: ${valorEnBs} Bs`, 20, 270);  // Monto original en Bs
    doc.text(`Total + IVA : ${valorEnBsConImpuesto} Bs`, 20, 290);  // Mostrar monto con 16% de impuesto
    doc.text(`Método de Pago: ${selectedMethod}`, 20, 310);
    doc.text(`Moneda: ${selectedCurrency}`, 20, 330); // Mostrar moneda seleccionada
    doc.text(`Número de Referencia: ${referenceNumber}`, 20, 350);
    doc.text(`Fecha de Pago: ${new Date().toLocaleDateString()}`, 20, 370);
    doc.text(`Hora de Emisión: ${new Date().toLocaleTimeString()}`, 20, 390);
    doc.line(20, 410, 206.772, 410);
    doc.setFontSize(10);
    doc.text('Gracias por su pago!', 113.386, 430, { align: 'center' });
    doc.setFont('Helvetica', 'bold');
    doc.text('Nota: Por favor guarde una foto de este recibo', 113.386, 450, { align: 'center' });

    const pdfBlob = doc.output('blob'); // Convertir el PDF a blob

    // Enviar el PDF al servidor para guardarlo
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `recibo_${facturaId}.pdf`);

    await fetch('/api/recibos', {
      method: 'POST',
      body: formData
    });

    doc.save('Recibo_de_Pago.pdf'); // Descargar el PDF localmente
  };

  // Reiniciar el formulario después del pago
  const resetForm = () => {
    selectedMethod = 'Pago Móvil';
    selectedCurrency = 'USD'; // Reiniciar moneda
    referenceNumber = '';
    banco = '';
    telefono = '';
    cedula = '';  // Reiniciar cédula
    clienteId = null;
    nombreCliente = '';
    facturaId = null;
    montoEnUsd = null;
    valorEnBs = null;
    valorEnBsConImpuesto = null;

    setTimeout(() => {
      window.location.reload();
    }, 5000); // Recargar la página después de 5 segundos
  };
</script>

<!-- Render del formulario -->
<section>
  {#if successMessage}
    <div class="bg-green-100 text-green-700 p-4 rounded mb-4">{successMessage}</div>
  {/if}

  {#if errorMessage}
    <div class="bg-red-100 text-red-700 p-4 rounded mb-4">{errorMessage}</div>
  {/if}

  <h3>Reportar Pago</h3>

  <!-- Mostrar montos -->
  <div>
    <label for="montoUsd">Monto a Pagar (USD):</label>
    <input type="text" id="montoUsd" value={montoEnUsd} readonly />
  </div>
  <div>
    <label for="montoBs">Monto a Pagar (BS):</label>
    <input type="text" id="montoBs" value={valorEnBs} readonly />
  </div>
  <div>
    <label for="montoBsImpuesto">Monto a Pagar con 16% (BS):</label>
    <input type="text" id="montoBsImpuesto" value={valorEnBsConImpuesto} readonly />
  </div>

  <!-- Campo de cédula -->
  <div>
    <label for="cedula">Cédula del Cliente:</label>
    <input type="text" id="cedula" bind:value={cedula} required />
  </div>
  <div>
    <label for="telefono">Número de Teléfono</label>
    <input type="text" id="telefono" bind:value={telefono} />
  </div>
  <!-- Selección del método de pago -->
  <div>
    <label for="method">Método de Pago:</label>
    <select id="method" bind:value={selectedMethod}>
      <option value="Efectivo">Efectivo</option>
      <option value="Zelle">Zelle</option>
      <option value="Pago Móvil">Pago Móvil</option>

    </select>
  </div>



  <!-- Selección de la moneda (solo efectivo) -->
  {#if selectedMethod === 'Efectivo'}
    <div>
      <label for="currency">Moneda:</label>
      <select id="currency" bind:value={selectedCurrency}>
        <option value="BS">BS</option>
        <option value="USD">USD</option>
        <option value="COP">COP</option>
      </select>
    </div>
  {/if}

  <!-- Referencia, banco y teléfono, solo si no es efectivo -->
  {#if selectedMethod !== 'Efectivo'}
    <div>
      <label for="reference">Número de Referencia:</label>
      <input type="text" id="reference" bind:value={referenceNumber} />
    </div>
    <div>
      <label for="banco">Banco Emisor </label>
      <select id="banco" bind:value={banco}>
        <option value="" disabled selected>Selecciona un Banco</option>
        <option value="0102">
          (0102) - Banco de Venezuela
       </option>
       <option value="0104">
          (0104) - Banco Venezolano de Crédito
       </option>
       <option value="0105">
          (0105) - Banco Mercantil
       </option>
       <option value="0108">
          (0108) - BBVA Banco Provincial
       </option>
       <option value="0114">
          (0114) - BanCaribe
       </option>
       <option value="0115">
          (0115) - Banco Exterior
       </option>
       <option value="0128">
          (0128) - Banco Caroní
       </option>
       <option value="0134">
          (0134) - Banesco
       </option>
       <option value="0137">
          (0137) - Banco Sofitasa
       </option>
       <option value="0138">
          (0138) - Banco Plaza
       </option>
       <option value="0151">
          (0151) - Banco Fondo Común (BFC)
       </option>
       <option value="0156">
          (0156) - 100% Banco
       </option>
       <option value="0157">
          (0157) - Del Sur
       </option>
       <option value="0163">
          (0163) - Banco del Tesoro
       </option>
       <option value="0166">
          (0166) - Banco Agrícola de Venezuela
       </option>
       <option value="0168">
          (0168) - BanCrecer, Banco de Desarrolo
       </option>
       <option value="0169">
          (0169) - Mi banco, Banco Microfinanciero, C.A.
       </option>
       <option value="0171">
          (0171) - Banco Activo
       </option>
       <option value="0172">
          (0172) - Bancamiga Banco Universal, C.A.
       </option>
       <option value="0174">
          (0174) - BanPlus, Banco Comercial
       </option>
       <option value="0175">
          (0175) - Banco Bicentenario, del Pueblo, de la Clase Obrera, Mujer y Comunas, Banco Universal, C.A.
       </option>
       <option value="0177">
          (0177) - Banco de las Fuerzas Armadas
       </option>
       <option value="0178">
          (0178) - N58 Banco Digital, Banco Microfinanciero, S.A.
       </option>
       <option value="0191">
          (0191) - Banco Nacional de Crédito, C.A. Banco Universal
       </option>
        <!-- Más bancos... -->
      </select>
    </div>
    <div>
      <label for="telefono">Número de Teléfono</label>
      <input type="text" id="telefono" bind:value={telefono} />
    </div>
  {/if}


  {#if selectedMethod === 'Zelle'}
  <div>
    <label for="reference">Correo emisor</label>
    <input type="text" id="reference" bind:value={referenceNumber} />

  </div>


  {/if}


  
  <button on:click={submitPayment}>Confirmar Pago</button>
</section>

<style>
  section {
    padding: 1rem;
    max-width: 600px;
    margin: auto;
  }
  input, select {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button {
    background-color: #28a745;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>