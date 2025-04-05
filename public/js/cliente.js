$(document).ready(function () {
    const $divpersona = $('#divpersona');
    const $divempresa = $('#divempresa');
    $divpersona.show();
    $divempresa.hide();
    $('#documento').attr('required', true);
    $('#nombre').attr('required', true);
    $('#apellido').attr('required', true);
    $('#razonsocial').attr('required', false);
    $('#ruc').attr('required', false);

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var idcli = urlParams.get('id');
    var tipo = $('#tipo').val();
    if (idcli != 0) {
        if (tipo == 1) {
            $divpersona.show();
            $divempresa.hide();
            $('#documento').attr('required', true);
            $('#nombre').attr('required', true);
            $('#apellido').attr('required', true);
            $('#razonsocial').attr('required', false);
            $('#ruc').attr('required', false);
        }
        else {
            $divpersona.hide();
            $divempresa.show();
            $('#documento').attr('required', false);
            $('#nombre').attr('required', false);
            $('#apellido').attr('required', false);
            $('#razonsocial').attr('required', true);
            $('#ruc').attr('required', true);
        }
    }

    $('#tipo').change(function () {
        if ($(this).val() === '1') {
            $divpersona.show();
            $divempresa.hide();
            $('#documento').attr('required', true);
            $('#nombre').attr('required', true);
            $('#apellido').attr('required', true);
            $('#razonsocial').attr('required', false);
            $('#ruc').attr('required', false);
        } else {
            $divpersona.hide();
            $divempresa.show();
            $('#documento').attr('required', false);
            $('#nombre').attr('required', false);
            $('#apellido').attr('required', false);
            $('#razonsocial').attr('required', true);
            $('#ruc').attr('required', true);
        }
    });


});
