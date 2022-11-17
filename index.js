

$(function () {

    var station = '8501120';

    function refresh() {
        if (station) {
            $.get('http://transport.opendata.ch/v1/stationboard', { id: station, limit: 5 }, function (data) {
                                console.log(data);

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
                    line += '</td><td>' + '🚆' +this.category + this.number + '</td><td>' + this.stop.platform + '</td><td>' + this.to + '</td></tr>';
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




