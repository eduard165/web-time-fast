// Función para realizar la solicitud y obtener el envío
async function searchShipment() {
    const trackingNumber = document.getElementById('tracking-number').value.trim();

    if (trackingNumber === '') {
        alert('Por favor, ingresa un número de guía.');
        return;
    }

    try {
        const response = await fetch(`/api/obtener-envio/${trackingNumber}`);
        const result = await response.json();

        if (result.error) {
            alert('No se encontró información para este envío.');
            return;
        }

        const envio = result.contenido;

        // Actualizar información del cliente
        const infoCliente = document.getElementById('info-cliente');
        infoCliente.innerHTML = `
            <h3>Información del Cliente</h3>
            <p><strong>Nombre:</strong> ${envio.nombreClienteCompleto}</p>
            <p><strong>Teléfono:</strong> ${envio.telefonoCliente}</p>
            <p><strong>Correo Electrónico:</strong> ${envio.correoElectronicoCliente}</p>
        `;

        // Actualizar información del colaborador
        const infoConductor = document.getElementById('info-conductor');
        infoConductor.innerHTML = `
            <h3>Información del Conductor</h3>
            <p><strong>Nombre:</strong> ${envio.nombreColaboradorCompleto}</p>
            <p><strong>Correo Electrónico:</strong> ${envio.correoElectronicoColaborador}</p>
        `;

        // Actualizar detalles del envío
        const infoEnvioDetalle = document.getElementById('info-envio-detalle');
        infoEnvioDetalle.innerHTML = `
            <h3>Detalles del Envío</h3>
            <p><strong>Número de Guía:</strong> ${envio.numeroGuia}</p>
            <p><strong>Costo:</strong> $${envio.costo}</p>
            <p><strong>Estado:</strong> ${envio.nombreEstado}</p>
            <p><strong>Dirección Origen:</strong> ${envio.calleOrigen}, ${envio.numeroOrigen}, ${envio.coloniaOrigen}, ${envio.codigoPostalOrigen}, ${envio.ciudadOrigen}, ${envio.estadoOrigen}</p>
            <p><strong>Dirección Destino:</strong> ${envio.calleDestino}, ${envio.numeroDestino}, ${envio.coloniaDestino}, ${envio.codigoPostalDestino}, ${envio.ciudadDestino}, ${envio.estadoDestino}</p>
        `;

    } catch (error) {
        console.error('Error al obtener el envío:', error);
        alert('Hubo un error al obtener la información del envío.');
    }
}


document.getElementById('search-btn').addEventListener('click', searchShipment);
