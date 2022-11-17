const inputFrom = document.querySelector('#from');
const inputTo = document.querySelector('#to');
const inputDate = document.querySelector('#datetime');
const form = document.querySelector('form');
const tableConnection = document.querySelector('#connection');

const formData = {};

form.addEventListener('submit', onSubmit);


function onSubmit(e) { 
    e.preventDefault(e);
    formData.from = inputFrom.value;
    formData.to = inputTo.value;
    formData.date = inputDate.value;

    console.log(formData.date);
    console.log(formData);



$(function () {

    var station = '8501120';

    function refresh() {
        if (station) {
            $.get(`http://transport.opendata.ch/v1/connections?from=${formData.from}&to=${formData.to}&date=${formData.date}`, { id: station, limit: 10 }, function (data) {
                console.log(data);

                
                // let departureTime = data.connections.from.departure
                $('#connection tbody').empty();
                $(data.connections).each(function () {
                    var departure, delay, line = '<tr><td>';
                    departure = moment(this.from.departure);
                    // console.log(this.duration);
                    // console.log(moment(this.duration));
                    // console.log(moment(this.duration).format('HH:mm'));
                    if (this.from.prognosis.departure) {
                        prognosis = moment(this.from.prognosis.departure);
                        delay = (prognosis.valueOf() - departure.valueOf()) / 60000;
                        line += departure.format('HH:mm') + ' <strong>+' + delay + ' min</strong>';
                    } else {
                        line += departure.format('HH:mm');
                    }
                    
                    let arrival = moment(this.to.arrival).format('HH:mm');
                    line += '</td><td>' + this.products + '</td><td>' + this.from.platform + '</td><td>' + this.duration.slice(3, 8) + '</td><td>' + arrival + '</td><td>' + this.to.platform + '</td></tr>';
                    $('#connection tbody').append(line);
                });
            }, 'json');
        }
    }

    $('#station').autocomplete({
        source: function (request, response) {
            $.get('http://transport.opendata.ch/v1/locations', { query: request.term, type: 'station' }, function (data) {
                response($.map(data.stations, function (station) {
                    return {
                        label: station.name,
                        station: station
                    }
                }));
            }, 'json');
        },
        select: function (event, ui) {
            station = ui.item.station.id;
            refresh();
        }
    });

    // setInterval(refresh, 30000);
    refresh();
});




    // function markup() {
    //     fetch(`http://transport.opendata.ch/v1/connections?from=${formData.from}&to=${formData.to}&date=${formData.date}`)
    //         .then(response => response.json())
    //     .then(data => console.log(data))
    //         // .then(data => { 
    //         //     let longitude = data.stations.from[0].coordinate.x;
    //         //     console.log(longitude);

    //         // })
    // }
    
    

    // setInterval(markup, 30000);
    // markup();



    // tableConnection.classList.add('vissible');
}