<template>
  <div class="ui two column centered grid">
    <div class="field change_language">
      <div>
        chang language
      </div>
      <select class="" v-model="language" style="height: fit-content;">
        <option>en</option>
        <option>ja</option>
        <option>thai</option>
      </select>
    </div>

    <div
      class="ui segment large form"
      style="z-index:1; width: 50%; height: 40%;"
    >
      <div
        class="ui segment large form"
        :class="{ error_mess: error.mess }"
        v-show="error.mess"
      >
        {{ error.mess }}
      </div>
      <div class="ui segment form_maps">
        <div>
          <div class="close right" @click="clearAction">X</div>
        </div>
        <div class="field">
          <div style="display:flex">
            <div
              class="ui right icon input large"
              style="padding-bottom: 15px;"
            >
              <input
                type="text"
                placeholder="Enter your address"
                v-model="addressFrom"
                id="autocomplete"
              />
              <i class="dot circle link icon" @click="locatorButtonPressed"></i>
            </div>
            <div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/61/61088.png"
                alt=""
                class="search"
                @click="direction = !direction"
              />
            </div>
          </div>
          <div v-show="direction" class="ui right icon input large">
            <input
              type="text"
              placeholder="Enter your address"
              v-model="addressTo"
              id="autocompleteTo"
            />
          </div>
        </div>
        <div class="field">
          <div class="two fields">
            <div v-show="direction" class="field">
              <select v-model="vehicle">
                <option>DRIVING</option>
                <option>TRANSIT</option>
                <option>WALKING</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <button v-show="direction" @click="searchRoute">Go</button>
      <div v-show="distance" style="color:red">
        Distance: {{ distance }}, Duration: {{ duration }} by: {{ vehicle }}
      </div>
    </div>
    <div id="container">
      <div v-show="showMap" id="map"></div>
      <div id="sidebar"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GoogleMap",
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
    this.autocomplete();
  },
  computed: {
    coordinates() {
      return `${this.lat}, ${this.lng}`;
    }
  },
  watch: {
    direction() {
      if (this.direction) {
        this.autocomplete();
      }
    },
    addressFrom(newVal) {
      this.isSearchAddressFrom = true;
      this.isSearchAddressTo = false;
      this.autocomplete();
      this.addressFrom = newVal;
    },
    addressTo(newVal) {
      this.isSearchAddressFrom = false;
      this.isSearchAddressTo = true;
      this.autocomplete();
    },
    // language(newVal) {
    //   let a = document.querySelectorAll(
    //     'script[src^="https://maps.googleapis.com"]'
    //   );
    //   console.log(a);
    // }
  },
  methods: {
    searchAction() {
      this.direction = !this.direction;
      // this.autocomplete()
    },
    autocomplete() {
      let element = "";
      if (this.direction) {
        element = document.getElementById("autocompleteTo");
      } else {
        element = document.getElementById("autocomplete");
      }
      let autocomplete = new google.maps.places.Autocomplete(element, {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(21.0304695, 105.7847317)
        )
      });

      autocomplete.addListener("place_changed", () => {
        let place = autocomplete.getPlace();
        if (this.isSearchAddressFrom) {
          this.addressFrom = place.formatted_address;
          this.showUserLocationOnTheMap(
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        } else if (this.isSearchAddressTo) {
          this.addressTo = place.formatted_address;
          this.searchRoute();
        }

        this;
        this.showMap = true;
      });
    },

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

      // const infowindow = new google.maps.InfoWindow({
      //   content: contentString
      // });

      const contentString = "<h1>xin chao</h1>";

      // create a map object
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      const image =
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
      // add Marker
      const marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: image,
        title: "Uluru (Ayers Rock)"
      });
      // marker.addListener("click", () => {
      //   infowindow.open({
      //     anchor: marker,
      //     map,
      //     shouldFocus: false
      //   });
      // });
    },
    clearAction() {
      (this.lat = ""),
        (this.lng = ""),
        (this.error.mess = ""),
        (this.addressFrom = ""),
        (this.addressTo = ""),
        (this.showMap = false);
      this.distance = "";
      // document.getElementById("directions_panel").innerHTML = "";
    },
    calculateAndDisplayRoute(directionsService, directionsRenderer) {
      directionsService
        .route({
          origin: {
            query: this.addressFrom
          },
          destination: {
            query: this.addressTo
          },
          travelMode: this.vehicle,
          drivingOptions: {
            departureTime: new Date(/* now, or future date */),
            trafficModel: "pessimistic"
          }
        })
        .then(response => {
          directionsRenderer.setDirections(response);
          this.distance = response.routes[0].legs[0].distance.text;
          this.duration = response.routes[0].legs[0].duration.text;
        })
        .catch(e => window.alert("Directions request failed due to " + status));
    },

    searchRoute() {
      // console.log(this.addressFrom, this.addressTo)
      if (!this.addressFrom || !this.addressTo) {
        return alert("Need to be know you want to go");
      }
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      var myLatlng = new google.maps.LatLng(21.0304695, 105.7847317);
      var mapOptions = {
        zoom: 15,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // create a map object
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      directionsRenderer.setMap(map);
      // document.getElementById("sidebar").remove()

      // let newDiv = document.createElement("div")
      // newDiv.setAttribute("id", "sidebar")
      // const currentDiv = document.getElementById("container")
      // document.body.appendChild(newDiv, currentDiv);

      // directionsRenderer.setPanel(document.getElementById("sidebar"));
      directionsRenderer.setOptions({
        polylineOptions: {
          strokeColor: "red"
        },
        styles: "hide"
      });
      new google.maps.Marker({
        position: myLatlng,
        map: map
      });
      console.log(directionsRenderer);
      document
        .getElementById("autocomplete")
        .addEventListener(
          "change",
          this.calculateAndDisplayRoute(directionsService, directionsRenderer)
        );
      // document.getElementById("autocompleteTo").addEventListener(
      //   "change",
      //   this.calculateAndDisplayRoute(directionsService, directionsRenderer)
      // );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ui.button {
  background-color: black;
  color: aliceblue;
}
.error_mess {
  background-color: red;
}
#map {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  padding-bottom: 70px;
}
.form_maps {
  /* display: flex;
  justify-content: flex-end; */
}
.close {
  cursor: pointer;
  transform: translate(0%, -50%);
}
.search {
  width: 30px;
  height: 30px;
  padding-left: 15px;
}
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.change_language {
  padding-top: 40px;
}
#sidebar {
  z-index: 5;
  flex-basis: 15rem;
  flex-grow: 1;
  padding: 1rem;
  max-width: 30rem;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  width: 100%;
  height: 500px;
  background-color: white;
  right: 0;
}
#sidebar {
  flex: 0 1 auto;
  padding: 0;
}
#sidebar > div {
  padding: 0.5rem;
}
#container {
  height: 100%;
  display: flex;
}
</style>
