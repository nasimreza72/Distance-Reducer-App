
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

let tMode = "DRIVING";


const shButton = document.querySelector(".hButton")
const showMap = document.getElementById("showMap");

showMap.addEventListener("click", (e) => {
  document.getElementById("sidebar").style.display="none"
  shButton.style.display = "block"
})

shButton.addEventListener("click", (e) => {
  document.getElementById("sidebar").style.display="block"
  shButton.style.display = "none"
})


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


transitMode.addEventListener("change", (e) => {
tMode = (e.target.value);
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

      let totalDistance = 0;
      let totalTravelTime = 0;

      summaryPanel.innerHTML = "";

      // For each route, display summary information.
      for (let i = 0; i < route.legs.length; i++) {

        const routeSegment = i + 1;
        totalDistance += route.legs[i].distance.value,
        totalTravelTime += route.legs[i].duration.value

        summaryPanel.innerHTML +=
          "<b>Route details: " + routeSegment + "</b><br>";
        summaryPanel.innerHTML += route.legs[i].start_address + " to ";
        summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
        summaryPanel.innerHTML += route.legs[i].duration.text + " & ";
        summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
      
        console.log("Route legs",route.legs);

      }



      document.getElementById("total-travel-time").innerHTML = "<b> Total Duration: </b>" + Math.floor((totalTravelTime/60)/60) + " hours"
     
      document.getElementById("total-distance").innerHTML = "<b> Total Distance: </b>" + Math.floor(totalDistance/1000) + " km"

   


    })
    .catch((e) => window.alert("please choose a travel mode!!"));
}