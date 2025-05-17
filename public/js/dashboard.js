$(document).ready(function () {
  $.ajax({
    url: '/dashboard/clientestop',
    method: 'GET',
    success: function (response) {
      const clientes = response.clientes;
      // const nombres = clientes.map(c => c.nombres);
      // alert(JSON.stringify(nombres));
      horizontalBarChart(clientes);
      console.log('Clientes por AJAX:', clientes);
    }
  });
  
  $.ajax({
    url: '/dashboard/asesorespie',
    method: 'GET',
    success: function (response) {
      const asesores = response.asesores;
      // const nombres = clientes.map(c => c.nombres);
      //alert(JSON.stringify(asesores));
      usuariosPastel(asesores);
      console.log('asesores por AJAX:', asesores);
    }
  });

});

function horizontalBarChart(data) {
  //Horizontal bar chart
  
  const nombres = data.map(c => c.nombres);
  const totcot = data.map(c => c.cotiz);
  const venta = data.map(c => c.ventas);
  //alert(JSON.stringify(nombres));

  new Chartist.Bar('#horizontal-bar-clientes', {
    labels: nombres, //['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    series: [totcot,venta
      //[5, 4, 3, 7, 5, 80, 3],
      //[3, 2, 9, 5, 4, 6, 4]
    ]
  }, {
    seriesBarDistance: 15,
    reverseData: true,
    horizontalBars: true,
    axisY: {
      offset: 100
    },
    plugins: [
      Chartist.plugins.tooltip()
    ]
  });
}

function usuariosPastel(data){

    const labels = data.map(c => c.nombres); //data.map(c => `${c.nombres} (${c.tot})`);
    const series = data.map(c => c.tot);

    new Chartist.Pie('#simple-pie_asesor', {
      labels: labels,
		  series: series
    }, {
      labelInterpolationFnc: function(value, index) {
        return `${labels[index]} (${series[index]})`;
      }
    });

    // new Chartist.Pie('#chart-pastel-clientes', {
    //   labels: ['Juan', 'Ana', 'Luis'],
		//   series: [5, 3, 4]
    // }, {
    //   labelInterpolationFnc: function(value, index) {
    //     return `${labels[index]} (${series[index]})`;
    //   }
    // });
}