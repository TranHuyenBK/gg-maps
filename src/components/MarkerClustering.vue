<template>
  <div id="map"></div>
</template>

<script>
import axios from "axios";

export default {
  name: "MarkerClustering",
  data() {
    return {
      lat: 0,
      lng: 0,
      type: "",
      vehicle: "DRIVING",
      places: [],
      addressFrom: "",
      addressTo: "",
      error: {
        mess: ""
      },
      showMap: true,
      direction: false,
      isSearchAddressFrom: false,
      isSearchAddressTo: false,
      distance: "",
      duration: "",
      language: "en"
    };
  },

  mounted() {
    this.locatorButtonPressed();
  },

  methods: {
    locatorButtonPressed() {
      this.error.mess = "";
      this.showMap = true;
      if (!navigator.geolocation) {
        console.log("doesn't exist");
      } else {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;

            this.getStreetAddressFrom(this.lat, this.lng);
            this.showUserLocationOnTheMap(this.lat, this.lng);
          },
          error => {
            console.log("Error getting location");
          }
        );
      }
    },
    async getStreetAddressFrom(lat, long) {
      await axios
        .get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            lat +
            "," +
            long +
            "&key=AIzaSyBtOLgSUOSajlVvqLxxQxi31BeQi_Kh6zg"
        )
        .then(response => {
          console.log(response);
          if (response.data.error_message) {
            this.error.mess = response.data.error_message;
          } else {
            this.addressFrom = response.data.results[0].formatted_address;
          }
        })
        .catch(error => {
          this.error.mess = error.message;
        });
    },
    showUserLocationOnTheMap(lat, lng) {
      var myLatlng = new google.maps.LatLng(lat, lng);
      var mapOptions = {
        zoom: 15,
        center: myLatlng,
        mapId: "9c135e5ecd3dcc28",
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        fullScreenControl: false
      };

      // create a map object
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      const image =
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
      // add Marker

      const markers = [
        { location: { lat: 21.0296837, lng: 105.7845082 } },
        { location: { lat: 21.028547, lng: 105.7839556 } },

        { location: { lat: 21.0284347, lng: 105.77608 } }
        // {
        //     location: {
        //         lat: 21.0163427, lng: 105.7818576
        //     }
        // },
      ];

      const marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: image,
        title: "Uluru (Ayers Rock)"
      });

      var latlng = markers.map(
        marker =>
          new google.maps.LatLng(marker.location.lat, marker.location.lng)
      );

      var latlngbounds = new google.maps.LatLngBounds();
      for (var i = 0; i < latlng.length; i++) {
        latlngbounds.extend(latlng[i]);
      }
      map.fitBounds(latlngbounds);
      //DIRECTION
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
markers
      const waypoints = [];

      for (let i = 1; i < markers.length; i++) {
        if (i > 0 && i < markers.length - 1) {
          waypoints.push({
            location: markers[i].location,
            stopover: true
          });
        }
      }

      this.calcRoute(
        directionsService,
        directionsRenderer,
        markers[0].location,
        markers[markers.length - 1].location,
        waypoints
      );
    },
    calcRoute(
      directionsService,
      directionsRenderer,
      origin,
      destination,
      waypoints
    ) {
      const selectedMode = "DRIVING";

      directionsService
        .route({
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode[selectedMode]
        })
        .then(response => {
          console.log(response);
          directionsRenderer.setDirections(response);
        })
        .catch(e => window.alert(" Direction request fail"));
    }
  }
};
</script>
<style scoped>
#map {
  position: initial !important;
}
</style>
