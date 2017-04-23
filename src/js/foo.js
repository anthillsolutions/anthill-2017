'use strict';

function myMap() {
  var latLng = new google.maps.LatLng(46.2054753,6.1231115,17);
  var image = {
    url: TWIG.imagePath + 'images/logo_round.png',
    size: new google.maps.Size(25, 25),
    scaledSize: new google.maps.Size(25,25),
  };
  var contentString = '<div>' +
  '<h2>anthillsolutions</h2>' +
  '<address>' +
  'rue des confessions, 15<br />' +
  '1203, Genève<br />' +
  'Switzerland' +
  '</address>' +
  '</div>';
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: latLng,
    zoom: 13,
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: image,
    title: 'anthillsolutions',
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}
