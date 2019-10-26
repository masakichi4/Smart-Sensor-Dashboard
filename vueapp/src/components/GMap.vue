<!-- <template>
    <div id="GMap"/>
</template>

<script>
import gmapsInit from '@/js/gmap';

export default {
  name: 'GMap',
  async mounted() {
    try {
      const google = await gmapsInit();
      const geocoder = new google.maps.Geocoder();
      const map = new google.maps.Map(this.$el);

      geocoder.geocode({ address: 'San Jose' }, (results, status) => {
        if (status !== 'OK' || !results[0]) {
          throw new Error(status);
        }

        map.setCenter(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);
      });

      console.log("debug gmap");
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

.GMap {
  width: 100vw;
  height: 100vh;
}
</style> -->