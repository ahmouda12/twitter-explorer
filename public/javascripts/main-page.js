let map;

function initmap() {
  
  const grayscale = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png');

  const map = L.map('map', {
    attributionControl: false,
    zoomControl:false,
    center: [20, 20],
    zoom: 2,
    minZoom: 2,
    maxZoom: 2,
    layers: [grayscale]
  });

  // Add markers to the map
  // const socket = io('//localhost:3000');
  const socket = io('twitter-explorer.herokuapp.com');
  socket.on('stream2', function(tweet){
    let coords = tweet.coordinaties;
    // console.log(tweet.text);

    const cssIcon = L.divIcon({
      // Specify a class name we can refer to in CSS.
      className: 'css-icon',
      html: '<div class="gps_ring"></div>',
      // Set marker width and height
      iconSize: [22,22],
      // iconAnchor: [11,11]
    });

    // console.log("location:", coords);
    coords.forEach(function(location){
      const center = {
      lat: coords[0], 
      lng: coords[1]
      };
      const pin = new L.marker([center.lat, center.lng], {
      icon: cssIcon}).addTo(map);

      setTimeout(function(){
        pin.remove();
      },4000);
      
    });
  });

}

initmap();
