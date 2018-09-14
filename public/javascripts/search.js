let map;
let heat;
let toggle = false;

function initmap() {
let markers = [];
  
  const grayscale = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png'),
      wihtescale   = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      
      const	heat = L.heatLayer(markers, {
        maxZoom: 4,
        radius: 8
      });

      const map = L.map('map', {
        attributionControl: false,
        center: [0, 0],
        zoom: 2,
        minZoom: 1,
        layers: [grayscale]
    });


    var baseMaps = {
      "Grayscale": grayscale,
      "Wihtescale": wihtescale
  };
  
  var overlayMaps = {
      "Heatmap": heat
  };

  L.control.layers(baseMaps, overlayMaps).addTo(map);

  // Add markers to the map
  const socket = io('//localhost:3000');
       socket.on('stream', function(tweet){
        // markers.push(loc);
        let coords = tweet.coordinaties;

      var html = '<div class="row tweet"><div class="col-md-2"><img src="' + tweet.profile_image_url + '"/></div><div class="col-md-10"><div class="names"><a class="full-name" href="http://twitter.com/' + tweet.username + '" target="_blank">' + tweet.username + ' </a></div><div class="contents"><span class="text">' + tweet.text + '</span></div></div></div>';
      $('#tweet-container').prepend(html);


      // <a href="http://twitter.com/{{tweet.username}}" target="_blank" class="names">@{{tweet.username}}</a>

        console.log(tweet.text);

          heat.addLatLng(coords);

          const cssIcon = L.divIcon({
            // Specify a class name we can refer to in CSS.
            className: 'css-icon',
            html: '<div class="gps_ring"></div>',
            // Set marker width and height
            iconSize: [22,22]
            // ,iconAnchor: [11,11]
          });
      
          console.log("location:", coords);
          coords.forEach(function(location){
           const center = {
            lat: coords[0], 
            lng: coords[1]
            };
           const pin = new L.marker([center.lat, center.lng], {
            icon: cssIcon}).addTo(map);

            setTimeout(function(){
              pin.remove();
            },3000);
            
          });
});

}

initmap();
