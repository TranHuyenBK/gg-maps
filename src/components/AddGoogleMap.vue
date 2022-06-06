<template>
  <div>
    <div>
      <h2>Vue Js Search and Add Marker</h2>
      <label>
        <gmap-autocomplete @place_changed="initMarker" @input="value = $event.target.value"></gmap-autocomplete>
        <button @click="addLocationMarker">Add</button>
      </label>
      <div style="padding-bottom: 20px">
        <input
          style="width: 45%; height:30px;"
          type="text"
          placeholder="Enter your address"
          v-model="addressFrom"
          id="autocomplete"
        />
        <img
          @click="addLocationMarker"
          src="https://cdn-icons-png.flaticon.com/512/61/61088.png"
          alt=""
          class="search"
        />
      </div>
      <div>
        <input
          style="width: 50%; height:30px"
          type="text"
          placeholder="Enter your address"
          v-model="addressTo"
          id="autocomplete"
          v-show="direction"
        />
      </div>
    </div>
    <br />
    <gmap-map :zoom="15" :center="center" style="width:100%;  height: 600px;">
      <gmap-marker
        :key="index"
        v-for="(m, index) in locationMarkers"
        :position="m.position"
        @click="center = m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "AddGoogleMap",
  data() {
    return {
      center: {
        lat: 21.0304695,
        lng: 105.7847317
      },
      locationMarkers: [],
      locPlaces: [],
      existingPlace: null,
      addressFrom: "",
      addressTo: "",
      direction: true,
      address: ""
    };
  },

  mounted() {
    this.locateGeoLocation();
  },

  methods: {
    initMarker(loc) {
      this.existingPlace = loc;
    },
    addLocationMarker() {
      if (this.existingPlace) {
        const marker = {
          lat: this.existingPlace.geometry.location.lat(),
          lng: this.existingPlace.geometry.location.lng()
        };
        this.locationMarkers.push({ position: marker });
        console.log(this.locationMarkers);
        this.locPlaces.push(this.existingPlace);
        this.center = marker;
        this.existingPlace = null;
      }
    },
    locateGeoLocation() {
      navigator.geolocation.getCurrentPosition(res => {
        console.log(res);
        this.center = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };
      });
    }
  }
};
</script>
<style scoped>
.search {
  width: 30px; height:30px;
}
</style>
