<template>
  <v-container fluid grid-list-md >
    <v-layout row wrap>
        <v-flex d-flex xs12 sm12 md12>
          
          <v-layout row>

            <v-flex d-flex>
              <v-card color="yellow lighten-5" class="text-md-center" hover>
                <v-card-title class="title  font-weight-light">Active Truck Nodes:
                </v-card-title>
                <v-card-text>
                    <v-progress-circular 
                    :value="(activeNodes.length/Object.values(this.nodes).length)*100"
                    color="orange"
                    :size="100"
                    width="15"
                    >
                    <span class="headline">{{((activeNodes.length/Object.values(this.nodes).length)*100).toFixed(0)}}%
                    </span>
                    </v-progress-circular>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex d-flex>
              <v-card color="yellow lighten-5" class="text-md-center" hover>
                <v-card-title class="title font-weight-light">Active Truck Sensors:
                </v-card-title>
                <v-card-text>
                    <v-progress-circular 
                        :value="(activeSensors.length/Object.values(this.sensors).length)*100"
                        color="yellow"
                        :size="100"
                        width="15"
                    >
                    <span class="headline">{{((activeSensors.length/Object.values(this.sensors).length)*100).toFixed(0)}}%<br/>
                    </span>
                    </v-progress-circular>
                </v-card-text>
               </v-card>
            </v-flex>
            
            <v-flex d-flex>
              <v-card class="text-md-center">
                <GChart
                type="LineChart"
                :data="lastUpdateData"
                :options="lastUpdateOptions"
                />
                <v-card-text class="headline font-weight-light">
                    Recent Sensor Updates
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        
        </v-flex>

        <v-flex d-flex xs12 sm12 md12>
          <v-layout row>

            <v-flex d-flex>
              <v-card 
              class="text-md-center">
                <GChart
                type="ColumnChart"
                :data="setupDateData"
                :options="setupDateOptions"
                />
                <v-card-text class="headline font-weight-light">
                    
                    Sensor Deployment By Date
                    <v-switch label="View All Dates" v-model="viewAllDates"/>
                    <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date"
                        label="Switch off and select a date"
                        prepend-icon="event"
                        v-on="on"
                        :disabled="viewAllDates"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
                  </v-menu>
                </v-card-text>
               </v-card>
            </v-flex>

            <v-flex d-flex>
                <v-layout column>
                    <v-flex d-flex>      
                      <v-card class="text-md-center" contain>
                        <v-card-title class="title font-weight-light">Deployed Sensors by Type:
                        </v-card-title>
                        <GChart
                        type="PieChart"
                        :data="sensorTypeData"
                        :options="sensorTypeOptions"
                        />
                      </v-card>
                    </v-flex>

                    <v-flex d-flex>
                      <v-card class="text-md-center">
                        <v-card-text class="headline font-weight-light">
                            <v-sparkline
                            fill
                            :gradient="gradient"
                            :smooth="20"
                            :value="temperatureValues"
                            padding="10"
                            ></v-sparkline>
                            Temperature Readings form Sensors
                        </v-card-text>
                      </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>


          </v-layout>
        </v-flex>

       
        <v-flex xs12 sm12 md12>
          <v-layout wrap>
            <v-flex>
                <v-card contain>
                
                  <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search sensor/type ID, type, location, setup date"
                  single-line
                  hide-details
                  box>
                  </v-text-field>
                  <v-card-title class="green lighten-3"> Active: </v-card-title>
                    <v-data-table
                    :headers="headers"
                    :items="activeSensors"
                    class="elevation-1"
                    :search="search">
                      <template slot="items" slot-scope="sensors">
                        <td> {{sensors.item.sensorId}}</td>
                        <td>{{sensors.item.sensorTypeId}} </td>
                        <td>{{sensors.item.setup_date}}</td>
                        <td>{{sensors.item.location}}</td>
                      </template>
                    </v-data-table>
                  <v-card-title class="red lighten-3"> Inactive: </v-card-title>
                    <v-data-table
                    :headers="headers"
                    :items="inactiveSensors"
                    class="elevation-1"
                    :search="search">
                      <template slot="items" slot-scope="sensors">
                        <td> {{sensors.item.sensorId}}</td>
                        <td>{{sensors.item.sensorTypeId}} </td>
                        <td>{{sensors.item.setup_date}}</td>
                        <td>{{sensors.item.location}}</td>
                      </template>
                    </v-data-table>     
                </v-card>
              </v-flex>

          </v-layout>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios'
  //import GMap from '@/components/GMap.vue'
  import { GChart } from 'vue-google-charts';

  export default {
    components: {
        GChart
    },
    data: () => ({
        viewAllDates: true,
        menu: false,
        // date: new Date().toISOString().substr(0, 10),
        date: "",
        setupDateOptions: {
            legend: {position: "none"},
            vAxis: {
                baseline: "automatic",
                minValue: 1,
                format: 'short',
            }
        },
        lastUpdateOptions: {
            legend: {position: "none"},
            colors: ['#1B5E20']
        },
        name: 'SupplierOriented',
        gradient: ['#ffd200', '#1feaea'],
        sparklineLabels: [
        '24h',
        '21h',
        '18h',
        '15h',
        '12h',
        '9h',
        '6h',
        '3h'
      ],
        sparklineValues: [4, 3, 5, 6, 5, 3, 4, 4, 6, 4, 5, 3, 3, 4, 3],
        search: '',
        trucksShown: [],
        sensorTypeOptions: {
            legend: {position:"right"}
        },
        headers: [
          {text: 'Sensor ID', align: 'left', value: 'sensorId'},
          {text: 'Sensor Type', align: 'left', value: 'sensorTypeId'},
          {text: 'Date Created', align: 'left', value: 'setup_date'},
          {text: 'Truck Location', align: 'left', value: 'location'}
        ],
        sensorData: [],
        sensors: {},
        nodes: {},
        trucks: []
    }), computed: {
        temperatureValues() {
            let a=[];
            var j;
            
            for(j=0;j<this.sensorData.length;j++) {
                // console.log(this.sensorData[j].temperature);
                if (this.sensorData[j].temperature) {
                    a.push(this.sensorData[j].temperature);
                }
            }
            return a;
        },
        setupDateData() {
            let a=[];
            a.push(["Date", "Sensors deployed"]);            
            var obj = this.numBySetupDates;
            if (!this.viewAllDates) {
                if (obj.hasOwnProperty(this.date)) {
                    a.push([this.date, obj[this.date]]);
                } else {
                    a.push([this.date, 0]);
                }
                return a;
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        a.push([key, obj[key]]);
                    }
                }
                return a;
            }      
        },
        numBySetupDates() {
            let obj={};
            var j;
            for(j=0;j<Object.values(this.sensors).length;j++) {
                var dateStr = Object.values(this.sensors)[j].setup_date.slice(0,10);
                if (obj[dateStr]) {
                    obj[dateStr] += 1;
                } else {
                    obj[dateStr] = 1;
                }
            }
            return obj;
        },
        lastUpdateData() {
            let a=[];
            a.push(["Date", "Sensors Updated"]);            
            var obj = this.numByLastUpdate;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    a.push([key, obj[key]]);
                }
            }
            return a;  
        },
        numByLastUpdate() {
            let obj={};
            var j;
            for(j=0;j<Object.values(this.sensors).length;j++) {
                var dateStr = Object.values(this.sensors)[j].last_update.slice(0,10);
                if (obj[dateStr]) {
                    obj[dateStr] += 1;
                } else {
                    obj[dateStr] = 1;
                }
            }
            return obj;
        },
        activeSensors() {
            let a = [];
            var j;
            for(j=0;j<Object.values(this.sensors).length;j++) {
                if (Object.values(this.sensors)[j].status=="1") {
                    a.push(Object.values(this.sensors)[j])
                }
            }
            return a;
        },
        inactiveSensors() {
            let a = [];
            var j;
            for(j=0;j<Object.values(this.sensors).length;j++) {
                if (Object.values(this.sensors)[j].status!="1") {
                    a.push(Object.values(this.sensors)[j])
                }
            }
            return a;
        },
        activeNodes() {
            let a = [];
            var j;
            for(j=0;j<Object.values(this.nodes).length;j++) {
                if (Object.values(this.nodes)[j].status=="1") {
                    a.push(Object.values(this.nodes)[j])
                }
            }
            return a;
        },
        inactiveNodes() {
            let a = [];
            var j;
            for(j=0;j<Object.values(this.nodes).length;j++) {
                if (Object.values(this.nodes)[j].status!="1") {
                    a.push(Object.values(this.nodes)[j])
                }
            }
            return a;
        },
        trucksEnRoute() {
            let a = [];
            var j;
            for(j=0;j<this.trucks.length;j++) {
                if (this.trucks[j].truckEnRoute) {
                    a.push(this.trucks[j].truckNo);
                }
            }
            return a;
        },
        sensorTypeData() {
            let a = [];
            a.push(["Sensor Type", "Number of Sensors per Type"]);
            a.push(["Temparature Sensor", this.numByType("1")]);
            a.push(["GPS Sensor", this.numByType("2")]);
            a.push(["RFID Sensor", this.numByType("3")]);
            a.push(["Other Types", this.numByType(null)]);
            return a;
        },
    }, methods: {
        numByType(sensorTypeId) {
            let count = 0;
            var j;
            for(j=0;j<Object.values(this.sensors).length;j++) {
                if (Object.values(this.sensors)[j].sensorTypeId==sensorTypeId) {
                    count +=1;
                }
            }
            return count;
        },
        removeFilter(item) {
            const index = this.trucksShown.indexOf(item.location)
            if (index>=0) this.trucksShown.splice(index, 1)
        }
    }, 
    async mounted() {
        axios
          .get('https://express281.herokuapp.com/selectSensorTruck')
          .then((response)=> {
            this.sensors = response.data
          });
        axios
          .get('https://express281.herokuapp.com/selectNodeTruck')
          .then((response)=> {
            this.nodes = response.data
          });
        axios
          .get('https://express281.herokuapp.com/sensorData')
          .then((response)=> {
            this.sensorData = response.data
          });
    }
  }
</script>

<style>

</style>
