$(document).ready(function () {
  const $tabVariantes = $('#tabVariantes');
  const $divprecio = $('#divprecio');
  const $divpreciorebaja = $('#divpreciorebaja');
  const $divstock = $('#divstock');

  // Asegurarse de que la visibilidad esté bien al cargar
  if ($('#tipo').val() == '2') {
    $tabVariantes.show();
    $divprecio.hide();
    $divpreciorebaja.hide();
    $divstock.hide();
  }else {
    $tabVariantes.hide();
    $divprecio.show();
    $divpreciorebaja.show();
    $divstock.show();
  }

  //Cambiar la visibilidad del tab cuando cambia la selección
  $('#tipo').change(function () {
    if ($('#tipo').val() == '2') {
      $tabVariantes.show();
      $divprecio.hide();
      $divpreciorebaja.hide();
      $divstock.hide();
    } else {
      $tabVariantes.hide();
      $divprecio.show();
      $divpreciorebaja.show();
      $divstock.show();
    }
  });


  $('#contenedor-actualiza').hide();

  //formulario grabar
  $('#frmProductos').submit(function (e) {
    e.preventDefault();

    //const formData = $(this).serialize();
    const form = this;
    const formData = new FormData(form); //$(this).serialize();
    $.ajax({
      url: '/productos/create',
      method: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        const msgDiv = $('#mensaje');
        //msgDiv.removeClass('d-none alert-success alert-danger');

        if (data.success) {
          //msgDiv.addClass('alert-success').text(data.message);
          Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: 'Este producto es Variable. ¿desea agregar las variantes?',
            confirmButtonText: 'Aceptar'
          });
          if ($('#tipo').val() == '2') {
            window.location.href = '/productos/edit/' + data.idprod;
          } else {
            window.location.href = '/productos';
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'No se pudo guardar.',
            confirmButtonText: 'Cerrar'
          });

          //msgDiv.addClass('alert-danger').text(data.message || 'Error al guardar.');
        }
      },
      error: function () {
        //$('#mensaje').removeClass('d-none').addClass('alert-danger').text('Error en la solicitud.');
      }
    });
  });

  //formulario editar
  $('#frmProductosedita').submit(function (e) {
    e.preventDefault();

    const form = this;
    const formData = new FormData(form); //$(this).serialize();
    const id = $('#idProducto').val();

    $.ajax({
      url: `/productos/edit/${id}`,
      method: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        const msgDiv = $('#mensaje');
        //msgDiv.removeClass('d-none alert-success alert-danger');

        if (data.success) {
          //msgDiv.addClass('alert-success').text(data.message);
          Swal.fire({
            icon: 'success',
            title: 'Actualizado!',
            text: 'Este producto se actualizo satisfactoriamente.',
            confirmButtonText: 'Aceptar'
          });
          window.location.href = '/productos';
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'No se pudo guardar.',
            confirmButtonText: 'Cerrar'
          });

          //msgDiv.addClass('alert-danger').text(data.message || 'Error al guardar.');
        }
      },
      error: function () {
        //$('#mensaje').removeClass('d-none').addClass('alert-danger').text('Error en la solicitud.');
      }
    });
  });

  //formulario editar
  $('#frmVariantes').submit(function (e) {
    e.preventDefault();

    const formData = $(this).serialize();
    const id = $('#idProducto').val();
    const idvar = $('#idvariante').val();

    if ($("#idvariante").val().trim() === "") {
      var url = `/productos/${id}/createvariante`;
    } else {
      var url = `/productos/editvariante/${idvar}`;
    }
    //alert(url);

    $.ajax({
      url: url,
      method: 'POST',
      data: formData,
      success: function (data) {
        //const msgDiv = $('#mensaje');
        //msgDiv.removeClass('d-none alert-success alert-danger');

        if (data.success) {
          //msgDiv.addClass('alert-success').text(data.message);
          //alert(data.message);
          Swal.fire({
            icon: 'success',
            title: 'Actualizado!',
            text: 'Este producto se actualizo satisfactoriamente.',
            confirmButtonText: 'Aceptar'
          });
          window.location.href = `/productos/edit/${id}`;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'No se pudo guardar.',
            confirmButtonText: 'Cerrar'
          });

          //msgDiv.addClass('alert-danger').text(data.message || 'Error al guardar.');
        }
      },
      error: function () {
        //$('#mensaje').removeClass('d-none').addClass('alert-danger').text('Error en la solicitud.');
      }
    });
  });

  $('.btn-ver').on('click', function (e) {
    e.preventDefault();
    $('#panelVariantes').addClass('show');
    $('#contenedor-guarda').show();
    $('#contenedor-actualiza').hide();
    const id = $(this).data('id');
    obtieneVariante(id);
  });

  function obtieneVariante(id) {
    const idprod = $('#idProducto').val();

    $.ajax({
      url: `/productos/${idprod}/${id}/getvarianteprod`,
      method: 'GET',

      success: function (data) {
        if (data.success) {
          $('#contenedor-guarda').hide(); //msgDiv.addClass('alert-success').text(data.message);
          $('#contenedor-actualiza').show();
          const atributos = data.VarianteProd;
          $('#contenedor-actualiza').empty();
          atributos.forEach(attr => {
            let texto = `<p><strong>${attr.nombre}</strong>: ${attr.valor}</p>`;
            $('#contenedor-actualiza').append(texto);
          });

          if (atributos.length > 0) {
            const datos = atributos[0]; // o data.VarianteProd[0]
            $("#idvariante").val(datos.id || '');
            $("#codigovar").val(datos.codigo || '');
            $("#preciovar").val((parseFloat(datos.precio) || 0).toFixed(2));
            $("#preciorebajavar").val((parseFloat(datos.preciorebaja) || 0).toFixed(2));
            $("#stockvar").val(parseFloat(datos.stock) || 0);
          }
        } else {

        }
      },
      error: function () {
        //$('#mensaje').removeClass('d-none').addClass('alert-danger').text('Error en la solicitud.');
      }
    });
  }

  $('#mostrarTarjeta').on('click', function () {
    $('#panelVariantes').addClass('show');
    $('#contenedor-guarda').show();
    $('#contenedor-actualiza').hide();
    $("#idvariante").val('');
    $("#codigovar").val('');
    $("#preciovar").val('0.00');
    $("#preciorebajavar").val('0.00');
    $("#stockvar").val('0');
  });

  $('#cerrarPanel').on('click', function () {
    $('#panelVariantes').removeClass('show');
  });

  $('.select-text').on('click', function () {
    $(this).select();  // Selecciona todo el contenido del input
  });

});



