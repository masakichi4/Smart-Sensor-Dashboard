<template>
  <v-container fluid grid-list-md >
    <v-layout row wrap>
        <v-flex d-flex xs12 sm12 md12>
          
          <v-layout row>

            <v-flex d-flex>
              <v-card color="cyan lighten-5" class="text-md-center" hover>
                <v-card-title class="title font-weight-light">Active Warehouse Sensors:
                </v-card-title>
                <v-card-text>
                    <v-progress-circular 
                        :value="(activeSensors.length/Object.values(this.sensors).length)*100"
                        color="lime"
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
              <v-card color="cyan lighten-5" class="text-md-center" hover>
                <v-card-title class="title  font-weight-light">Active Warehouse Nodes:
                </v-card-title>
                <v-card-text>
                    <v-progress-circular 
                    :value="(activeNodes.length/Object.values(this.nodes).length)*100"
                    color="cyan"
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
                      <v-card contain>
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
                            :smooth="10"
                            :value="altitudeValues"
                            padding="5"
                            ></v-sparkline>
                            Altitude Readings form Sensors
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
  //import mysqlQuery from '@/js/mysqlQuery';
  import axios from 'axios';
  import { GChart } from 'vue-google-charts';

  export default {
    components: {
        GChart
    },
    data: () => ({
        sensorData: [],
        viewAllDates: true,
        menu: false,
        // date: new Date().toISOString().substr(0, 10),
        date: "",
        sparklineLabels: [],
        // temperatureValues: [
        // 10, 12, 15, 19, 15, 20, 16, 17, 18, 16, 15, 17, 13, 14, 10
        // ],
        gradient: ['#f72047', '#ffd200', '#1feaea'],
        search: '',
        warehousesShown: [],
        headers: [
          {text: 'Sensor ID', align: 'left', value: 'sensorId'},
          {text: 'Sensor Type', align: 'left', value: 'sensorTypeId'},
          {text: 'Date Created', align: 'left', value: 'setup_date'},
          {text: 'Location', align: 'left', value: 'location'}
        ],
        sensorTypeOptions: {
            legend: {position:"right"},
            slices: {
                0: { color: '#CDDC39' },
                1: { color: '#FF5722' },
                2: { color: '#00BCD4'},
                3: { color: '#FF5252' }
            }
        },
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
        sensors: {},
        nodes: {},
        warehouses: []
    }), computed: {
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
        allTypes() {
            let a = [];
            var j;
            for(j=0;j<Object.values(this.sensors).length;j++) {
                if (!a.includes(Object.values(this.sensors)[j].sensorType)) {
                    a.push(Object.values(this.sensors)[j].sensorType);
                }
            }
            return a;
        },
        monitoredWarehouses() {
            let a = [];
            var j;
            for(j=0;j<this.warehouses.length;j++) {
                if (this.warehouses[j].warehouseMonitored) {
                    a.push(this.warehouses[j].warehouseName);
                }
            }
            return a;
        },
        sensorTypeData() {
            let a = [];
            a.push(["Sensor Type", "Number of Sensors per Type"]);
            a.push(["Temperature Sensor", this.numByType("1")]);
            a.push(["GPS Sensor", this.numByType("2")]);
            a.push(["RFID Sensor", this.numByType("3")]);
            a.push(["Other Types", this.numByType(null)]);
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
        altitudeValues() {
            let a=[];
            var j;
            
            for(j=0;j<this.sensorData.length;j++) {
                // console.log(this.sensorData[j].altitude);
                if (this.sensorData[j].altitude) {
                    a.push(this.sensorData[j].altitude);
                }
            }
            return a;
        }
    }, 
    methods: {
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
            const index = this.warehousesShown.indexOf(item.location)
            if (index>=0) this.warehousesShown.splice(index, 1)
        }
    }, 
    mounted() {
        axios
          .get('https://express281.herokuapp.com/selectSensorWarehouse')
          .then((response)=> {
            this.sensors = response.data
          });
        axios
          .get('https://express281.herokuapp.com/selectNodeWarehouse')
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
