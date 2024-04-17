<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col mb-3">
        <div class="card fs-2 p-3">
          <div class="d-flex justify-content-between">
            <div class="my-auto text-dark">
              <p class="mb-0 text-bold">User</p>
              <p class="m-0 text-lg text-bolder">{{ users.length }}</p>
            </div>
            <div class=" p-1 px-2 text-success">
              <font-awesome-icon icon="fa-solid fa-users"/>
            </div>
          </div>
        </div>
      </div>
      <div class="col mb-3">
        <div class="card fs-2 p-3">
          <div class="d-flex justify-content-between">
            <div class="my-auto text-dark">
              <p class="mb-0 text-bold">Customer</p>
              <p class="m-0 text-lg text-bolder">{{ customers.length }}</p>
            </div>
            <div class=" p-1 px-2 text-success">
              <font-awesome-icon icon="fa-solid fa-user"/>
            </div>
          </div>
        </div>
      </div>
      <div class="col mb-3">
        <div class="card fs-2 p-3">
          <div class="d-flex justify-content-between">
            <div class="my-auto text-dark">
              <p class="mb-0 text-bold">Seller</p>
              <p class="m-0 text-lg text-bolder">{{ sellers.length }}</p>
            </div>
            <div class=" p-1 px-2 text-success">
              <font-awesome-icon icon="fa-solid fa-store"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 col-md-6 col-12 mb-3">
        <user-table
        @data-length-users="dataFromUsersChild"
        />
      </div>
      <div class="col-lg-4 col-md-6 col-12 mb-3">
        <customer-table 
          @data-length-customers="dataFromCustomerChild"
          ref="customersRef"
        />
      </div>
      <div class="col mb-3">
        <seller-table
          @data-length-sellers="dataFromSellerChild"
          ref="sellersRef"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import SellerTable from './components/SellerTable.vue';
import CustomerTable from './components/CustomerTable.vue';
import UserTable from './components/UserTable.vue';

export default {
  name: "admin",
  components: {
    UserTable,
    CustomerTable,
    SellerTable,
  },
  data() {
    return {
      config: {
        url: process.env.VUE_APP_URL_DEVELOPER,
        endpointV1: process.env.VUE_APP_ENDPOINT_V1,
        headers: {"Content-Type": "application/json"}
      },
      auth: {
        token: localStorage.getItem("token")
      },
      users: {
        length: 0,
        detail: []
      },
      customers: {
        length: 0,
        detail: []
      },
      sellers: {
        length: 0,
        detail: []
      },
    };
  },
  created(){
    const token = this.auth.token
    if (!token) this.$router.push({name: "Signin"})
    this.config.headers.authorization = token
  },
  async mounted(){
    await this.getDashboard()
  },
  methods: {
    createNotif(type, text, duration = 3000){
        this.$notify({
          type: type,
          duration: duration,
          text: text,
        })
    },

    async dataFromUsersChild(data) {
      this.users.length = data
      const childCustomer = this.$refs.customersRef
      const childSeller = this.$refs.sellersRef

      childCustomer.$forceUpdate()
      childSeller.$forceUpdate()

      await childCustomer.getAllCustomers()
      await childSeller.getAllSeller()

    },

    dataFromSellerChild(data) {
      this.sellers.length = data
    },

    dataFromCustomerChild(data) {
      this.customers.length = data
    },

    async getDashboard(){
      try {
        const objConfig = this.config
        const users = this.users
        const customers = this.customers
        const sellers = this.sellers
        const config = {
          method: "GET",
          url: objConfig.url + objConfig.endpointV1 + 'dashboard',
          headers: objConfig.headers
        }
        const data = await axios(config)
        const dataGet = data.data.data
        
        users.length = dataGet.totalUsers
        customers.length = dataGet.totalProfiles
        sellers.length = dataGet.totalStores
        
        users.detail = dataGet.listUsers
        customers.detail = dataGet.listProfiles
        sellers.detail = dataGet.listStores


      } catch (error) {
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, get Data failed")
        }
      }
    },
  }
};
</script>
