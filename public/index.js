function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: { lat:  52.520008, lng: 13.404954},
  });

  directionsRenderer.setMap(map);
  document.getElementById("submit").addEventListener("click", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}


const checkboxArray = document.getElementById("waypoints");
const inputMaker = document.getElementById("addInput");

inputMaker.addEventListener("click", ()=> {
  const input = document.createElement("input");
  input.value = "";
  input.type="text";
  checkboxArray.style.position="relative"
  input.placeholder="destination address here..."
  const deleteButton = document.createElement("span")
  deleteButton.className= "dButton"
  deleteButton.innerHTML = "x"
  
  checkboxArray.appendChild(input)

  document.getElementById('dButton').appendChild(deleteButton).addEventListener("click" , (e) =>{
      input.remove()
      deleteButton.remove()
  })

  
})

const transitMode = document.getElementById("transit-mode")

let tMode = "DRIVING";

transitMode.addEventListener("click", (e) => {
  tMode = (e.target.value);
console.log(tMode);

})
   

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
 
  const waypts = [];

  for (let i = 0; i < checkboxArray.children.length; i++) {
    if (checkboxArray.children.value!== null) {
      waypts.push({
        location: checkboxArray.children[i].value,
        stopover: true,
      });
    }
  }

console.log(typeof tMode);

  directionsService
    .route({
      origin: document.getElementById("start").value,
      destination: document.getElementById("end").value == "" ? document.getElementById("start").value : document.getElementById("end").value,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: tMode,
      transitOptions: {
        departureTime: new Date(),
        modes: ['BUS'],
        routingPreference: 'FEWER_TRANSFERS'
      },
      // unitSystem: google.maps.UnitSystem.IMPERIAL
    })
    .then((response) => {
      directionsRenderer.setDirections(response);

      const route = response.routes[0];
      const summaryPanel = document.getElementById("directions-panel");

      summaryPanel.innerHTML = "";

      // For each route, display summary information.
      for (let i = 0; i < route.legs.length; i++) {
        const routeSegment = i + 1;

        summaryPanel.innerHTML +=
          "<b>Route details: " + routeSegment + "</b><br>";

        console.log(route.legs);

        summaryPanel.innerHTML += route.legs[i].start_address + " to ";
        summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
        summaryPanel.innerHTML += route.legs[i].duration.text + " & ";
        summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
      }
    })
    .catch((e) => window.alert("please choose a travel mode!!"));
}