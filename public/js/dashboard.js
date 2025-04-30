$(document).ready(function () {
  // $.ajax({
  //   url: '/dashboard/clientestop',
  //   method: 'GET',
  //   success: function(response) {
  //     const clientes = response.clientestop;
  //     alert(clientes);
  //     console.log('Clientes por AJAX:', clientes);
  //   }
  // });
  //   horizontalBarChart();
});

function horizontalBarChart(){
    //Horizontal bar chart
    

    new Chartist.Bar('#horizontal-bar-clientes', {
            labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
            series: [
              [5, 4, 3, 7, 5, 80, 3],
              [3, 2, 9, 5, 4, 6, 4]
            ]
          }, {
            seriesBarDistance: 10,
            reverseData: true,
            horizontalBars: true,
            axisY: {
              offset: 70
            },
            plugins: [
              Chartist.plugins.tooltip()
            ]
          });
}