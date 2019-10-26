<template>
  <div>
      <v-app id="dashboard" class="grey lighten-3">
        
            <!-- <v-flex xs12> -->

                <v-navigation-drawer
                app
                fixed
                permanent
                class="blue lighten-2"
                dark
                width="250"
                >
                  <v-toolbar flat
                  class="blue lighten-1">
                    <v-list>
                      <v-list-tile>
                        <v-list-tile-title class="title">
                          {{username}}'s Dashboard
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-toolbar>
              
                  <v-divider></v-divider>
              
                  <v-list class="pt-0">
                    <v-list-tile
                      v-for="item in items"
                      :key="item.title"               
                      class="tile"
                      active-class="'primary--text'"
                      @click="toggleDashboard(item.title)"
                    >
                      <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                      </v-list-tile-action>
              
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile
                    key="Home"
                    class="tile"
                    active-class="'primary--text'"
                    ><v-list-tile-action>
                        <v-icon>home</v-icon>
                      </v-list-tile-action>
              
                      <v-list-tile-content>
                        <a style="color:white; text-decoration: none;" href="http://ssc-load-balancer-719980759.us-west-1.elb.amazonaws.com/home"> Home</a>
                      </v-list-tile-content>
                    
                  </v-list-tile>
                  </v-list>

                </v-navigation-drawer>
            <!-- </v-flex> -->
        <!-- <v-layout column wrap > -->
        <v-content>
            <Warehouse v-show="choice=='warehouseBased'||dashboardChoice=='warehouseBased'"/>
            <SupplierOriented v-show="choice=='supplierOriented'||dashboardChoice=='supplierOriented'"/>
            <v-container fluid fill-height v-show="choice=='account'">
              <v-layout align-center justify-center>
                <v-flex xs12 sm6 md4>
                    <v-card class="elevation-12" >
                      <v-toolbar dark color="primary" >
                        <v-toolbar-title>Goodbye!</v-toolbar-title>
                        <v-spacer></v-spacer>                
                      </v-toolbar>
                      
                      <v-card-text class="text-md-center">
                        <v-spacer></v-spacer>
                        <v-btn round color="error" dark to="/">Log Out</v-btn>
                      </v-card-text>
                    </v-card>
                </v-flex>
              </v-layout>
            </v-container> 
        </v-content>
        <!-- </v-layout> -->
      </v-app>
    </div>
</template>

<script>
import Warehouse from '@/components/Warehouse.vue'
import SupplierOriented from '@/components/SupplierOriented.vue'

export default{
    name: 'Dashboard',
    props: {
        username: String, 
        dashboardChoice: String
    },
    components: {
        Warehouse,
        SupplierOriented
    },
    data: () => ({
        showWarehouse: true,
        showSupplier: false,
        choice: '',
        items: [
        { title: 'Warehouse Based', icon: 'domain' },
        { title: 'Supplier Oriented', icon: 'local_shipping' },
        { title: 'Account', icon: 'account_box'}
      ],
    }),
    methods: {
        toggleDashboard(title) {
            this.dashboardChoice = null;
            if (title== 'Warehouse Based') {
                this.choice="warehouseBased";
            } else if (title=='Supplier Oriented') {
                this.choice="supplierOriented";
            } else if (title=='Account') {
                this.choice="account";
            }
        }
    },
    computed: {
    }
}
</script>
<style scoped>
    .tile:active {
        background-color: #1E88E5;
    }
    .tile:valid {
        background-color: #1E88E5;
    }
    .activeTile {
        background-color: #1E88E5;
    }
</style>