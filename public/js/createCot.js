$(document).ready(function () {

    $('#miModal').on('shown.bs.modal', function () {
        $('#single-select_p').select2({
            dropdownParent: $('#miModal')
        });
    });

    $('.select-text').on('click', function () {
        $(this).select();  // Selecciona todo el contenido del input
    });

    // $("#smartwizard").css("height", "800px");

    let cotizaciodet = [];
    // let productos = [];

    $("#single-select_p").change(function () {
        var productoId = $(this).val();
        if (productoId) {
            // Realizamos una solicitud fetch para obtener los datos del producto
            fetch('producto/' + productoId)
                .then(response => response.json())
                .then(data => {
                    // Si los datos del producto fueron recibidos correctamente
                    if (data) {
                        // Pintamos los datos del producto en los inputs

                        document.getElementById('tipoprod').value = Math.round(data.tipo);
                        document.getElementById('preciounit').value = Math.round(data.precio);
                        document.getElementById('preciocot').value = Math.round(data.precio);

                        // document.getElementById('descripcion').value = data.descripcion;
                        // document.getElementById('precio').value = data.precio;
                        // document.getElementById('stock').value = data.stock;
                    }
                })
                .catch(error => {
                    console.error('Error al obtener los datos del producto:', error);
                });
        } else {
            // Limpiar los inputs si no se seleccionó un producto
            document.getElementById('preciounit').value = '0.00';
            document.getElementById('preciocot').value = '0.00';
            // document.getElementById('precio').value = '';
            // document.getElementById('stock').value = '';
        }
    });

    $("#cantidad").change(function () {
        var cantidad = $(this).val();
        var precio = $("#preciocot").val();
        var importe = precio * cantidad
        $("#subtotal").val(importe.toFixed(2));
    });

    // $("#preciocot").change(function () {
    //     var cantidad = $(this).val();
    //     var precio = $("#preciocot").val();
    //     var importe = precio * cantidad
    //     $("#subtotal").val(importe.toFixed(2));
    // });

    $('#agregarProducto').click(function () {
        // Recoger los valores de los inputs
        const idproducto = $('#single-select_p').val();
        const descripcion = $('#single-select_p option:selected').text();
        const cantidad = parseFloat($('#cantidad').val());
        const idumd = $('#umedida').val();
        const umedida = $('#umedida option:selected').text();
        const precio = parseFloat($('#preciocot').val());
        const importe = parseFloat($('#subtotal').val());
        const observacion = $('#observacion').val();
        const tipo = $('#tipoprod').val();

        if (cantidad && precio && importe) {

            // Crear un objeto producto
            const producto = {
                tipo: tipo,
                idprod: idproducto,
                cantidad: cantidad,
                idumd: idumd,
                preciounit: precio,
                subtotal: importe,
                observacion: observacion
            }
            // Agregar al arreglo de productos
            cotizaciodet.push(producto);

            // Crear una nueva fila en la tabla
            const nuevaFila = $('<tr></tr>');

            // Insertar celdas en la nueva fila
            nuevaFila.append('<td>' + descripcion + ' ' + observacion + '</td>');
            nuevaFila.append('<td>' + cantidad + '</td>');
            nuevaFila.append('<td>' + umedida + '</td>');
            nuevaFila.append('<td>' + precio + '</td>');
            nuevaFila.append('<td class="importe">' + importe + '</td>');
            nuevaFila.append('<td><div class="d-flex"><a href="#" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fa fa-pencil"></i></a><a href="#" class="eliminarFila btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a></div></td>');

            // Agregar la nueva fila a la tabla
            $('#tabla-productos tbody').append(nuevaFila);
            // Llamar a la función después de agregar filas a la tabla
            $('#smartwizard').smartWizard("fixHeight");
            actualizarTotal();
            actualizarAlturaWizard();
            // actualizarAlturaWizard();
            actualizarScroll();
            
            // Limpiar los campos de entrada
            $('#single-select_p').val('0');
            $('#cantidad').val('0');
            $('#umedida').val('1');
            $('#preciounit').val('0.00');
            $('#preciocot').val('0.00');
            $('#subtotal').val('0.00');

            $(".eliminarFila").last().click(function () {
                // Eliminar del arreglo y de la tabla
                const fila = $(this).closest("tr");
                const productoEliminado = {
                    nombre: fila.find("td:nth-child(1)").text(),
                    //cantidad: parseInt(fila.find("td:nth-child(2)").text()),
                    //precio: parseFloat(fila.find("td:nth-child(3)").text())
                };
                cotizaciodet = cotizaciodet.filter(p => p.nombre !== productoEliminado.nombre);
                fila.remove();
                actualizarTotal();  // Actualizar el total después de eliminar un producto
            });
        }
        else {
            alert("Por favor, completa todos los campos.");
        }
    });

    $("#btnEnviarCot").click(function () {
        event.preventDefault(); // Previene la recarga de la página
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción guardará y generará el PDF",
            //icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Guardar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                enviaCotizacion(cotizaciodet);
                // if (enviaCotizacion(cotizaciodet)==true){
                //     Swal.fire(
                //         "Eliminado!",
                //         "El registro ha sido eliminado.",
                //         "success"
                //     );
                // }
                // Aquí puedes ejecutar la acción
                console.log("Usuario confirmó la acción");
            } else {
                console.log("Usuario canceló la acción");
            }
        });
    });
});

// Función para actualizar los subtotales y el total de la cotización
function actualizarTotal() {
    let total = 0;

    // Iterar a través de cada fila de la tabla
    $('#tabla-productos tbody tr').each(function () {
        // Obtener la cantidad y el precio unitario
        //const cantidad = $(this).find('input[id^="cantidad"]').val();
        //const importe = $(this).find('input[id^="subtotal"]').val();
        const importe = parseFloat($(this).find('.importe').text());
        // Calcular el subtotal
        //const subtotal = cantidad * precioUnitario;

        // Actualizar el subtotal en la tabla
        // $(this).find('.subtotal').text(importe);
        //$('#subtotal').text(importe);

        // Sumar el subtotal al total
        total += importe;
    });

    // Actualizar el total en la página
    $('#subtotcot').val(total.toFixed(2));
    const igv = total * 0.18
    $('#igvcot').val(igv.toFixed(2));
    const totales = total + igv
    $('#totcot').val(totales.toFixed(2));
}

function enviaCotizacion(cotizaciodet) {
    let cotizacion = [];
    const _fecha = $("#fecha").val();  // Obtener el nombre del cliente desde el formulario
    const _idcli = $('#single-select').val();  // Obtener el nombre del cliente desde el formulario
    const _tipopago = $("#tipopago").val();  // Obtener el nombre del cliente desde el formulario
    const _condicionentrega = $("#condicionentrega").val();  // Obtener el nombre del cliente desde el formulario
    const _fechaentrega = $("#fechaentrega").val();  // Obtener el nombre del cliente desde el formulario
    const _idmon = $("#idmon").val();  // Obtener el nombre del cliente desde el formulario
    const _descripcion = $("#descripcion").val();  // Obtener el nombre del cliente desde el formulario
    const _subtotcot = $("#subtotcot").val();  // Obtener el nombre del cliente desde el formulario
    const _igvcot = $("#igvcot").val();  // Obtener el nombre del cliente desde el formulario
    const _totcot = $("#totcot").val();  // Obtener el nombre del cliente desde el formulario
    const _idcia = $("#idcia").val();


    //const total = parseFloat($("#totalCotizacion").text());  // Obtener el total calculado de la cotización

    // Verificar si el nombre del cliente está ingresado
    if (!_idcli) {
        alert("Por favor, ingresa el nombre del cliente.");
        return;
    }

    const cotiza = {
        numcot: "",
        fecha: _fecha,
        idcli: _idcli,
        tipopago: _tipopago,
        condicionentrega: _condicionentrega,
        fechaentrega: _fechaentrega,
        idmon: _idmon,
        descripcion: _descripcion,
        subtotcot: _subtotcot,
        igvcot: _igvcot,
        totcot: _totcot,
        idcia: _idcia
    }
    cotizacion.push(cotiza)

    // Enviar los datos al servidor
    $.ajax({
        url: "/cotizaciones/create",  // URL del servidor
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            //cliente: cliente,
            cotizacion: cotizacion,
            cotizaciodet: cotizaciodet
        }),
        success: function (response) {
            Swal.fire(
                "Actualizado!",
                "El registro ha sido guardado.",
                "success"
            );
            window.location.href = '/cotizaciones';
            // Mostrar respuesta del servidor
            //alert(response);
            //alert("Cotización enviada con éxito. ");

        },
        error: function (error) {

            console.error("Error al enviar la cotización:", error);
            alert("Hubo un error al enviar la cotización.");
        }
    });
}

function actualizarScroll() {
    let cardBody = $(".card-body");
    cardBody.scrollTop(cardBody.prop("scrollHeight")); // Baja el scroll al final
}

function actualizarAlturaWizard() {
    let alturaContenido = $(".tab-content").prop("scrollHeight"); 
    $(".tab-content").css("height", alturaContenido + "px");
}
/* function actualizarAlturaWizard() {
    let wizard = $("#smartwizard");
    let alturaContenido = wizard.prop("scrollHeight"); 
    wizard.css("height", alturaContenido + "px");
} */

