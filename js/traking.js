const URL_WS_ENVIO = 'http://localhost:8084/time-fast/api/envios/consultar';
const URL_WS_PAQUETES = 'http://localhost:8084/time-fast/api/paquetes/consultar';

async function obtenerEnvio() {
    const trackingNumber = document.getElementById('tracking-number').value.trim();

    if (trackingNumber === '') {
        alert('Por favor, ingresa un número de guía.');
        return;
    }

    const infoCliente = document.getElementById('info-cliente');
    const infoConductor = document.getElementById('info-conductor');
    const infoEnvioDetalle = document.getElementById('info-envio-detalle');

    infoCliente.innerHTML = '<p>Cargando información del cliente...</p>';
    infoConductor.innerHTML = '<p>Cargando información del conductor...</p>';
    infoEnvioDetalle.innerHTML = '<p>Cargando detalles del envío...</p>';

    try {
        const respuestaEnvio = await fetch(`${URL_WS_ENVIO}/${encodeURIComponent(trackingNumber)}`,{ 
            method: 'GET'
        });
        const resultEnvio = await respuestaEnvio.json();

        if (resultEnvio.error) {
            throw new Error('No se encontró información para este envío.');
        }

        const envio = resultEnvio.envio;

        infoCliente.innerHTML = `
            <h3>Información del Cliente</h3>
            <strong>Nombre: </strong> ${envio.nombreClienteCompleto} <br>
            <strong>Correo: </strong> ${envio.correoElectronicoCliente} <br>
            <strong>Telefono: </strong> ${envio.telefonoCliente} <br>
        `;
        infoConductor.innerHTML = `
            <h3>Información del Conductor</h3>
            <strong>Nombre del Colaborador:</strong> ${envio.nombreColaboradorCompleto} <br>
            <strong>Correo:</strong> ${envio.correoElectronicoColaborador} <br>
        `;

        await obtenerDetallesPaquetes(envio.idEnvio, infoEnvioDetalle);

    } catch (error) {
        console.log('Error al obtener envío:', error);
        infoCliente.innerHTML = '<p>Hubo un error al consultar la información del envío.</p>';
        infoConductor.innerHTML = '<p>Hubo un error al consultar al conductor.</p>';
        infoEnvioDetalle.innerHTML = '<p>Hubo un error al obtener detalles del envío.</p>';
    }
}

async function obtenerDetallesPaquetes(idEnvio, infoEnvioDetalle) {
    try {
        const respuestaPaquetes = await fetch(`${URL_WS_PAQUETES}/${idEnvio}`,{ 
            method: 'GET'
        });
        const resultPaquetes = await respuestaPaquetes.json();
        console.log(resultPaquetes);
        console.log(idEnvio);
        if (resultPaquetes.paquetes.length === 0) {
            throw new Error('No se encontraron paquetes para este envío.');
        }
        mostrarInformacionPaquetes(resultPaquetes, infoEnvioDetalle);
        
        
    } catch (error) {
        console.log('Error al obtener paquetes:', error);
        infoEnvioDetalle.innerHTML = '<p>Hubo un error al obtener los detalles de los paquetes.</p>';
    }
}

function mostrarInformacionPaquetes(resultPaquetes, infoEnvioDetalle)   {
    let contenidoPaquetes = `<h3>Paquetes</h3>`;
    
    resultPaquetes.paquetes.forEach(paquete => {
        contenidoPaquetes += `
            <div>
                <p><strong>Descripción:</strong> ${paquete.descripcion}</p>
                <p><strong>Peso:</strong> ${paquete.peso} kg</p>
                <p><strong>Dimensiones:</strong> ${paquete.dimensionesAlto} x ${paquete.dimensionesAncho} x ${paquete.dimensionesProfundidad}</p>
            </div>
        `;
        contenidoPaquetes += '<hr>';
    });

    infoEnvioDetalle.innerHTML = contenidoPaquetes;
}
