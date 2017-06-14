$(function() {
    var map = L.map('canal-map', {
        maxZoom: 18,
        minZoom: 7
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGVycmFpbmZpcm1hIiwiYSI6InJBRi05azQifQ.hgCgPpkInPAxBh_A6H2nfA', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        }).addTo(map);

    //L.tileLayer('http://wag.viaeuropa.uk.com/viaeuropa/pluswp8hb5/hybrid/{z}/{x}/{y}.png').addTo(map);

    var westbound_photoLayer = L.photo.cluster().on('click', function (evt) {
        var photo = evt.layer.photo,
            template = '<img src="{url}" width="{width}" height="{height}" /></a><p>{caption}</p><p>{datetime}</p>';

        if (photo.video && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
            template = '<video autoplay controls poster="{url}" width="400" height="300"><source src="{video}" type="video/mp4"/></video>';
        };

        evt.layer.bindPopup(L.Util.template(template, photo), {
            className: "leaflet-popup-photo",
            minWidth: photo.width
        }).openPopup();
    });

    var chester_photoLayer = L.photo.cluster().on('click', function (evt) {
        var photo = evt.layer.photo,
            template = '<img src="{url}" width="{width}" height="{height}" /></a><p>{caption}</p><p>{datetime}</p>';

        if (photo.video && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
            template = '<video autoplay controls poster="{url}" width="300" height="300"><source src="{video}" type="video/mp4"/></video>';
        };

        evt.layer.bindPopup(L.Util.template(template, photo), {
            className: "leaflet-popup-photo",
            minWidth: photo.width
        }).openPopup();
    });

    var eastbound_photoLayer = L.photo.cluster().on('click', function (evt) {
        var photo = evt.layer.photo,
            template = '<img src="{url}" width="{width}" height="{height}" /></a><p>{caption}</p><p>{datetime}</p>';

        if (photo.video && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
            template = '<video autoplay controls poster="{url}" width="300" height="300"><source src="{video}" type="video/mp4"/></video>';
        };

        evt.layer.bindPopup(L.Util.template(template, photo), {
            className: "leaflet-popup-photo",
            minWidth: photo.width
        }).openPopup();
    });

    var extent_photoLayer = L.photo.cluster().on('click', function (evt) {
        //use for extent
    });

    // initialize map
    function fullExtent() {
        var extent_photoLayer = L.photo.cluster().on('click', function (evt) {
            //use for extent
        });
        extent_photoLayer.add(westbound_data.rows);
        extent_photoLayer.add(chester_data.rows);
        extent_photoLayer.add(eastbound_data.rows);
        map.fitBounds(extent_photoLayer.getBounds());
    }

    fullExtent();

    westbound_photoLayer.add(westbound_data.rows).addTo(map);

    // build an array of coordinates
    /*var latlngs = [];
    for (i in middlewich_canal.features) {
        var f = middlewich_canal.features[i]
        var coordinates = f.geometry.coordinates;
        for (j in coordinates) {
            latlngs.push([coordinates[j][1], coordinates[j][0]]);
        }
    }
    console.log(latlngs);
    var line = L.polyline(latlngs, {snakingSpeed: 200});
    console.log(line);
    line.addTo(map).snakeIn();*/

    L.geoJson(shropshire_union_canal, {style: context_style}).addTo(map);

    L.geoJson(shropshire_union_canal_middlewich, {style: route_style}).addTo(map);
    L.geoJson(shropshire_union_canal_route, {style: route_style}).addTo(map);
    L.geoJson(trent_and_mersey_canal, {style: route_style}).addTo(map);

    function route_style(feature) {
        return {
            weight: 3,
            opacity: 1,
            dashArray: '10',
            color: 'blue'
        };
    }

    function context_style(feature) {
        return {
            weight: 2,
            opacity: 1,
            //dashArray: '10',
            color: '#75aaff'
        };
    }

    var geojsonMarkerOptions = {
        radius: 7,
        fillColor: "#ff7800",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    };

    var pubsLayer = L.geoJson(pubs, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.NAME, {className: 'customlabel'});
        }
    });

    var marker = L.marker([53.19162, -2.441514]).addTo(map);
    marker.bindPopup("<b>Started in Middlewich</b><br>", {autoPan: false, className: 'customlabel'});

    var junction_marker = L.marker([53.108675, -2.579658]).addTo(map);
    junction_marker.bindPopup("<b>Barbridge Junction</b><br>", {autoPan: false, className: 'customlabel'});

    var chester_marker = L.marker([53.1918, -2.8927]).addTo(map);
    chester_marker.bindPopup("<b>Chester</b><br>", {autoPan: false, className: 'customlabel'});

    function labelDelay() {
        window.setTimeout(delayedPopup1, 500);
        window.setTimeout(delayedPopup2, 2000);
        window.setTimeout(delayedPopup3, 3500);
        window.setTimeout(closer, 6000);
    }

    function delayedPopup1() {
        marker.openPopup();
    }

    function delayedPopup2() {
        junction_marker.openPopup();
    }

    function delayedPopup3() {
        chester_marker.openPopup();
    }

    function closer() {
        chester_marker.closePopup();
    }

    labelDelay();

//    var popup = L.popup()
//        .setLatLng([53.1918, -2.8927])
//        .setContent("I am a standalone popup.")
//        //.openOn(map);
//    .addTo(map);

    //var legend = L.control({position: 'bottomright'});
    //legend.addTo(map);

    $('#reset').on('click', function(){
        fullExtent();
    });

    $('#pubs').on('click', function() {
        if ($(this).hasClass('active')) {
            map.removeLayer(pubsLayer);
        } else {
            pubsLayer.addTo(map);
        }
    });

    $('.btn-primary').on('click', function(){
        if ($(this).find('input').is(':checked')) {

            // deactivate the layer
            switch($(this).find('input').attr('id')) {
                case 'option1': {
                    westbound_photoLayer.clear();
                    break;
                }
                case 'option2': {
                    chester_photoLayer.clear();
                    break;
                }
                case 'option3': {
                    eastbound_photoLayer.clear();
                    break;
                }
            }
        }
        else {

            // activate the layer

            switch($(this).find('input').attr('id')) {
                case 'option1': {
                    westbound_photoLayer.clear();
                    westbound_photoLayer.add(westbound_data.rows).addTo(map);
                    map.fitBounds(westbound_photoLayer.getBounds());
                    break;
                }
                case 'option2': {
                    chester_photoLayer.clear();
                    chester_photoLayer.add(chester_data.rows).addTo(map);
                    map.fitBounds(chester_photoLayer.getBounds());
                    break;
                }
                case 'option3': {
                    eastbound_photoLayer.clear();
                    eastbound_photoLayer.add(eastbound_data.rows).addTo(map);
                    map.fitBounds(eastbound_photoLayer.getBounds());
                    break;
                }
            }
        }
    });
});