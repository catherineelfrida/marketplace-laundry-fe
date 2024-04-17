<template>
  <div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <transaction-table v-if="auth.role === 2" />
            <order-table v-if="auth.role === 1" />
        </div>
    </div>
  </div>
</template>

<script>
import TransactionTable from './components/TransactionTable.vue';
import OrderTable from './components/OrderTable.vue';

export default {
    name: 'transaction',
    data(){
      return {
        config: {
          url: process.env.VUE_APP_URL_DEVELOPER,
          endpointV1: process.env.VUE_APP_ENDPOINT_V1,
          headers: {"Content-Type": "application/json"}
        },
        auth: {
          token: localStorage.getItem("token"),
          role: parseInt(localStorage.getItem("role")),
          profileId: localStorage.getItem("profileId"),
          storeId: localStorage.getItem("storeId")
        },
      }
    },
    created(){
      const auth = this.auth
      const role = auth.role
      const id = role === 1 ? auth.profileId : auth.storeId
      if (id === '0') this.$router.push({name: "Profile"})
    },
    components: {
        TransactionTable,
        OrderTable
    }
}
</script>