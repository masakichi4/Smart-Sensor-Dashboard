<template>
  <v-app id="login">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>

          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>System Dashboard Login</v-toolbar-title>
                <v-spacer></v-spacer>
                
              </v-toolbar>
              <v-card-text>
                <v-form id="form" 
                @submit="submit"
                v-model=valid 
                lazy-validation>
                  <v-text-field 
                  prepend-icon="person" 
                  label="Username"
                  name="username" 
                  type="text"
                  v-model=username
                  :rules="inputRules"></v-text-field>
                  <v-text-field 
                  id="password" 
                  prepend-icon="lock" 
                  name="password" 
                  label="Password" 
                  type="password"
                  v-model=password
                  :rules="inputRules"></v-text-field>
                  <v-radio-group 
                  v-model="dashboardChoice" 
                  row>
                    <v-radio 
                    label="Warehouse Based" 
                    value="warehouseBased"
                    color="primary"
                    ></v-radio>
                    <v-radio 
                    label="Supplier Oriented" 
                    value="supplierOriented"
                    color="primary"></v-radio>
                  </v-radio-group>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="!valid" color="primary" @click=submit>Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      dashboardChoice: null,
      drawer: null,
      valid: false,
      username: '',
      password: '',
      inputRules: [
      v => !!v || 'This field is required'
      ]
    }),
    methods: {
      submit() {
        console.log(this.dashboardChoice)
        this.$router.push({ name: 'Dashboard', params: { username: this.username, dashboardChoice: this.dashboardChoice } })
      }
    },
    props: {
      source: String
    }
  }
</script>