<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Edit Profile</p>

                <div class="ms-auto d-flex" >
                  <argon-button 
                    color="light" 
                    size="sm" 
                    :disabled="homeButton()"
                    @click="goToHome()"
                  >
                    Home
                  </argon-button>
                </div>
                <div class="my-auto mx-3">
                    <font-awesome-icon icon="fa-solid fa-bars" role="button" @click="toggleSidebar()"/>
                  </div>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">User Information</p>
              <!-- SELLER -->
              <div v-if="auth.role === 2" class="row">
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label"
                    >Store name</label
                  >
                  <argon-input type="text" v-model:value="store.name" class="mb-0"/>
                  <p class="mt-0 me-2 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 21" ><small>{{ objError.message }}</small></p>
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label"
                    >Telephone</label
                  >
                  <argon-input type="text" v-model:value="store.telephone" class="mb-0"/>
                  <p class="mt-0 me-2 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 22" ><small>{{ objError.message }}</small></p>
                </div>
                <div class="col-md-2">
                  <label for="example-text-input" class="form-control-label"
                    >Open</label
                  >
                  <argon-input type="time" step="3600" v-model:value="store.open" class="mb-0"/>
                  <p class="mt-0 me-2 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 23" ><small>{{ objError.message }}</small></p>
                </div>
                <div class="col-md-2">
                  <label for="example-text-input" class="form-control-label"
                    >Close</label
                  >
                  <argon-input type="time" step="3600" v-model:value="store.close" class="mb-0"/>
                  <p class="mt-0 me-2 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 24" ><small>{{ objError.message }}</small></p>
                </div>
                <div class="col-md-12 mt-2">
                  <label for="example-text-input" class="form-control-label"
                    >Address</label
                  >
                  <argon-input type="text" v-model:value="store.address" class="mb-0"/>
                  <p class="mt-0 me-2 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 25" ><small>{{ objError.message }}</small></p>
                </div>
              </div>
              
              <!-- CUSTOMERS -->
              <div v-if="auth.role === 1" class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Name</label
                  >
                  <argon-input type="text" v-model:value="customer.name" class="mb-0" />
                  <p class="mt-0 me-2 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 11" ><small>{{ objError.message }}</small></p>
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Telephone</label
                  >
                  <argon-input type="text" v-model:value="customer.telephone" class="mb-0" />
                  <p class="mt-0 me-2 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 12" ><small>{{ objError.message }}</small></p>
                </div>
                <div class="col-md-12 mt-2">
                  <label for="example-text-input" class="form-control-label"
                    >Address</label
                  >
                  <argon-input type="text" v-model:value="customer.address" class="mb-0" />
                  <p class="mt-0 me-2 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 13" ><small>{{ objError.message }}</small></p>
                </div>
              </div>
              
              <div class="d-flex flex-row-reverse">
                <argon-button 
                  color="success" 
                  size="sm" 
                  class="ms-auto mt-3"
                  @click="manageProfile()"
                >
                  {{ userInfoButton }} User Information
                </argon-button>
              </div>
              
              <hr class="horizontal dark" />
              <!-- User -->
              <p class="text-uppercase text-sm">User Account</p>
              <div class="row">
                <div class="col-md-5">
                  <label for="example-text-input" class="form-control-label"
                    >Username</label
                  >
                  <argon-input type="text" v-model:value="auth.username"/>
                </div>
                <div class="col-md-5">
                  <label for="example-text-input" class="form-control-label"
                    >Password</label
                  >
                  <argon-input type="password" v-model:value="auth.password" />
                </div>
                <div class="col-md-2">
                  <label for="example-text-input" class="form-control-label"
                    >Role</label
                  >
                  <input class="form-control mb-4" type="text" :value="auth.objRole[auth.role]" aria-label="Disabled input example" disabled readonly />
                </div>
                <div class="d-flex flex-row-reverse">
                  <argon-button color="success" size="sm" class="ms-auto" @click="updateUser()">
                    Update User Account
                  </argon-button>
                </div>
              </div>
              <hr class="horizontal dark" />
            </div>
            <div class="card-footer" >
              <div class="d-flex align-items-center">
                <!-- <argon-button color="danger" size="sm" >
                  Delete
                </argon-button> -->
                <argon-button color="warning" size="sm" class="ms-auto" @click="logout()">
                  Logout
                </argon-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
// import { provinsi, kabupaten, kecamatan, desa } from 'daftar-wilayah-indonesia'
import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
// import ProfileCard from "./components/ProfileCard.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

import { mapMutations } from "vuex";

const body = document.getElementsByTagName("body")[0];

export default {
  name: "profile",
  data() {
    return {
      showMenu: false,
      userInfoButton: "",
      config: {
        url: process.env.VUE_APP_URL_DEVELOPER,
        endpointV1: process.env.VUE_APP_ENDPOINT_V1,
        headers: {"Content-Type": "application/json"}
      },
      auth: {
        token: localStorage.getItem("token"),
        userId: localStorage.getItem("userId"),
        role: parseInt(localStorage.getItem("role")),
        profileId: localStorage.getItem("profileId"),
        storeId: localStorage.getItem("storeId"),
        username: "",
        password: "",
        objRole: {
          1: "Customer",
          2: "Store"
        }
      },
      // wilayah: {
      //   kelurahan: [],
      //   kecamatan: [],
      //   kabupaten: [],
      //   provinsi: [],
      // },
      store: {
        name: "",
        telephone: "",
        address: "",
        open: "",
        close: ""
      },
      customer: {
        name: "",
        telephone: "",
        address: "",
      },
      objError: {
        in: 0,
        message: ""
      }
    };
  },
  components: { 
    // ProfileCard, 
    ArgonInput, 
    ArgonButton 
  },

  created() {
    const auth = this.auth
    const token = auth.token

    if (!token) this.$router.push({name: "Signin"})

    const role = auth.role
    const isCustomer = role === 1
    const roleId = isCustomer ? auth.profileId : auth.storeId
    this.config.headers.authorization = token


    if (isCustomer) {
      if (roleId === '0') {
        this.userInfoButton = "Create"
        this.createNotif("error", "Please complete your user information to turn on the feature.", -1)
      } else {
        this.userInfoButton = "Update"
        this.getDataCustomer()
      }
    } else {
      if (roleId === '0') {
        this.userInfoButton = "Create"
        this.createNotif("error", "Please complete your user information to turn on the feature.", -1)
      } else {
        this.userInfoButton = "Update"
        this.getDataStore()
      }
    }
  },

  mounted() {
    this.$store.state.isAbsolute = true;
    setNavPills();
    setTooltip();
  },
  beforeMount() {
    this.$store.state.imageLayout = "profile-overview";
    this.$store.state.showNavbar = false;
    this.$store.state.showFooter = true;
    this.$store.state.hideConfigButton = true;
    body.classList.add("profile-overview");
  },
  beforeUnmount() {
    this.$store.state.isAbsolute = false;
    this.$store.state.imageLayout = "default";
    this.$store.state.showNavbar = true;
    this.$store.state.showFooter = true;
    this.$store.state.hideConfigButton = false;
    body.classList.remove("profile-overview");
  },

  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
      if(this.auth.profileId) localStorage.removeItem('profileId')
      if(this.auth.storeId) localStorage.removeItem('storeId')

      this.$router.push({name: "Signin"})
    },


    ...mapMutations(["navbarMinimize"]),

    toggleSidebar() {
      // this.toggleSidebarColor("bg-white");
      this.navbarMinimize();
    },

    goToHome(){
      const name = this.auth.role === 1 ? "Store" : "/"
      this.$router.push({name: name})
    },

    createNotif(type, text, duration = 3000){
      this.$notify({
        type: type,
        duration: duration,
        text: text,
      })
    },

    getTimeHelper(stringTimeTZ) {
      const dateObj = new Date(stringTimeTZ);
      const hours = dateObj.getUTCHours();
      const minutes = dateObj.getUTCMinutes();

      // Mengonversi jam dan menit ke format hh:mm
      const formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
      return formattedTime
    },

    // getAlamat() {
    //   console.log("provinsi", provinsi);
    //   console.log("kabupaten", kabupaten);
    //   console.log("kecamatan", kecamatan);
    //   console.log("desa", desa);
    // },

    homeButton() {
      const auth = this.auth
      const isCustomer = auth.role === 1 
      if (isCustomer) return auth.profileId === '0'
      return auth.storeId === '0'
    },

    manageProfile() {
      const auth = this.auth
      const role = auth.role
      const objConfig = this.config
      const objErr = this.objError
      try {
        let error = {}
        let roleId = ""
        objErr.in = 0
        objErr.message = ""
        // let isCreate = 0
        
        if (role === 1){
          roleId = auth.profileId
          const customer = this.customer
          const name = customer.name
          const telephone = customer.telephone
          const address = customer.address

          if (!name) {
            error = new Error('Name cant be empty')
            error.status = 400
          } else if (!telephone) {
            error = new Error('Telephone cant be empty')
            error.status = 400
          } else if (!address) {
            error = new Error('Address cant be empty')
            error.status = 400
          }

          if (error.status) throw error

          roleId = auth.profileId
          if  (roleId === "0") {
            this.createCustomer(objConfig, name, telephone, address)
          } else {
            this.updateCustomer(objConfig, name, telephone, address)
          }
        }else {
          const store = this.store
          const name = store.name
          const telephone = store.telephone
          const address = store.address
          const open = store.open
          const close = store.close
          
          if (!name) {
            error = new Error('Store name cant be empty')
            error.status = 400
          } else if (!telephone) {
            error = new Error('Telephone cant be empty')
            error.status = 400
          } else if (!open) {
            error = new Error('Open cant be empty')
            error.status = 400
          } else if (!close) {
            error = new Error('Close cant be empty')
            error.status = 400
          } else if (!address) {
            error = new Error('Address cant be empty')
            error.status = 400
          }

          if (error.status) throw error

          roleId = auth.storeId
          if (roleId === "0") {
            this.createStore(objConfig, name, address, telephone, open, close)
          } else {
            this.updateStore(objConfig, name, address, telephone, open, close)
          }
        }
        
      } catch (error) {
        const codeError = error.status
        if(codeError === 400) {
          const message = error.message
          const errorIn = message.split(" ")[0]

          if (role === 1){
            if (errorIn === "Name") objErr.in = 11
            if (errorIn === "Telephone") objErr.in = 12
            if (errorIn === "Address") objErr.in = 13
          } else {
            if (errorIn === "Store") objErr.in = 21
            if (errorIn === "Telephone") objErr.in = 22
            if (errorIn === "Open") objErr.in = 23
            if (errorIn === "Close") objErr.in = 24
            if (errorIn === "Address") objErr.in = 25
          }

          objErr.message = message
        }
      }
    },

    async getDataStore() {
      try {
        const objConfig = this.config
        const objStore = this.store
        const getStoreConfig = {
          method: 'GET',
          url: objConfig.url + objConfig.endpointV1 + "stores/" + this.auth.storeId,
          headers: objConfig.headers,
        }

        const data = await axios(getStoreConfig)
        const dataStore = data.data.data

        objStore.name = dataStore.store_name
        objStore.telephone = dataStore.telephone
        objStore.address = dataStore.address
        objStore.open = this.getTimeHelper(dataStore.open_time)
        objStore.close = this.getTimeHelper(dataStore.close_time)
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error")
        }
      }
    },

    async createStore(objConfig, name, address, telephone, open, close) {
      try {
        const createStoreConfig = {
          method: 'POST',
          url: objConfig.url + objConfig.endpointV1 + "stores",
          headers: objConfig.headers,
          data: {
            store_name: name,
            address: address,
            telephone: telephone,
            open_time: open + ":00",
            close_time: close + ":00",
          }
        }

        
        const data = await axios(createStoreConfig)
        const dataCreate = data.data.data
        localStorage.setItem("storeId", dataCreate.id)
        this.createNotif("success","Create Store Successfully")
        this.userInfoButton = "Update"
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Create Store Failed")
        }
      }
    },

    async updateStore(objConfig, name, address, telephone, open, close){
      try {
        const updateStoreConfig = {
          method: 'PUT',
          url: objConfig.url + objConfig.endpointV1 + "stores",
          headers: objConfig.headers,
          data: {
            store_name: name,
            address: address,
            telephone: telephone,
            open_time: open + ":00",
            close_time: close + ":00",
          }
        }

        await axios(updateStoreConfig)
        this.createNotif("success","Update Store Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Update Store Failed")
        }
      }
    },

    async getDataCustomer(){
      try {
        const objConfig = this.config
        const objCustomer = this.customer
        const getCustomerConfig = {
          method: 'GET',
          url: objConfig.url + objConfig.endpointV1 + "profiles/" + this.auth.profileId,
          headers: objConfig.headers,
        }

        const data = await axios(getCustomerConfig)
        const dataCustomer = data.data.data

        objCustomer.name = dataCustomer.name
        objCustomer.telephone = dataCustomer.telephone
        objCustomer.address = dataCustomer.address
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error")
        }
      }
    },

    async createCustomer(objConfig, name, telephone, address) {
      try {
        const createCustomerConfig = {
          method: "POST",
          url: objConfig.url + objConfig.endpointV1 + "profiles",
          headers: objConfig.headers,
          data: {
            name: name,
            address: address,
            telephone: telephone,
          }
        }

        const data = await axios(createCustomerConfig)
        const dataCreate = data.data.data
        console.log(dataCreate);
        localStorage.setItem("profileId", dataCreate.id)
        this.createNotif("success","Create Customer profile Successfully")
        this.userInfoButton = "Update"
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Create Customer profile Failed")
        }
      }
    },

    async updateCustomer(objConfig, name, telephone, address){
      try {
        const updateCustomerConfig = {
          method: 'PUT',
          url: objConfig.url + objConfig.endpointV1 + "profiles",
          headers: objConfig.headers,
          data: {
            name: name,
            address: address,
            telephone: telephone
          }
        }

        await axios(updateCustomerConfig)
        this.createNotif("success","Update Customer Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Update Customer profile Failed")
        }
      }
    },

    async updateUser(){
      try {
        const objConfig = this.config
        const authUser = this.auth
        const username = authUser.username
        const password = authUser.password

        let error = {}
        if (!username) {
          error = new Error('Username cant be empty')
          error.status = 400
        } else if (!password) {
          error = new Error('Password cant be empty')
          error.status = 400
        }

        if (error.status) throw error

        const updateUser = {
          method: 'PUT',
          url: objConfig.url + objConfig.endpointV1 + "users/" + authUser.userId,
          headers: objConfig.headers,
          data: {
            username: username,
            password: password,
            role: authUser.role === 1 ? "CUSTOMER" : "SELLER"
          }
        }

        await axios(updateUser)
        this.createNotif("success", "Update User Successfully")

        authUser.username = ""
        authUser.password = ""

      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Update User Failed");
        } else if (codeError === 400){
          this.createNotif("error", error.message, -1)
        }
      }
    }

  }
};
</script>
