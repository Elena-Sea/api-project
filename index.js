

$(function () {

    var station = '8501120';

    function refresh() {
        if (station) {
            $.get('http://transport.opendata.ch/v1/stationboard', { id: station, limit: 10 }, function (data) {
                console.log(data);
                let lat = data.station.coordinate.x;
                console.log(lat);
                let long = data.station.coordinate.y;
                console.log(long);
                document.getElementById('body-station').classList.remove('body-station');
                document.getElementById('body-station').classList.remove('body-station-rain');
                document.getElementById('body-station').classList.remove('body-station-snow');
                document.getElementById('rain').classList.remove('vissible');
                document.getElementById('thunder').classList.remove('vissible');
                document.getElementById('snow').classList.remove('vissible');
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&timezone=GMT&daily=weathercode`)
                    .then(resp => resp.json())
                    .then(weatherData => {
                        
                        console.log(weatherData.daily.weathercode.slice(1, 2))
                        let weatherCode = weatherData.daily.weathercode.slice(1, 2);
                        if (weatherCode.includes(80) || weatherCode.includes(81) || weatherCode.includes(82)) {

                            document.getElementById('rain').classList.add('vissible');
                            document.getElementById('body-station').classList.add('body-station-rain');
                        } else if (weatherCode.includes(0) || weatherCode.includes(1) || weatherCode.includes(2) || weatherCode.includes(3)) { 
                            document.getElementById('body-station').classList.add('body-station');
                        } else if (weatherCode.includes(95) || weatherCode.includes(96) || weatherCode.includes(99)) { 
                            document.getElementById('rain').classList.add('vissible');
                            document.getElementById('body-station').classList.add('body-station-rain');
                            document.getElementById('thunder').classList.add('vissible');
                        } else if (weatherCode.includes(77) || weatherCode.includes(71) || weatherCode.includes(73) || weatherCode.includes(85)) { 
                            document.getElementById('body-station').classList.add('body-station-snow');
                            document.getElementById('snow').classList.add('vissible');
                        } else if (weatherCode.includes(86) || weatherCode.includes(85)) { 
                            document.getElementById('body-station').classList.add('body-station-snow');
                            document.getElementById('rain').classList.add('vissible');
                            document.getElementById('snow').classList.add('vissible');
                        }

                    })

                $('#stationboard tbody').empty();
                $(data.stationboard).each(function () {
                    var prognosis, departure, delay, line = '<tr><td>';
                    departure = moment(this.stop.departure);
                    if (this.stop.prognosis.departure) {
                        prognosis = moment(this.stop.prognosis.departure);
                        delay = (prognosis.valueOf() - departure.valueOf()) / 60000;
                        line += departure.format('HH:mm') + ' <strong>+' + delay + ' min</strong>';
                    } else {
                        line += departure.format('HH:mm');
                    }
                    line += '</td><td>' +this.category + this.number + '</td><td>' + this.stop.platform + '</td><td>' + this.to + '</td></tr>';
                    $('#stationboard tbody').append(line);
                     

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

    setInterval(refresh, 30000);
    refresh();
});




