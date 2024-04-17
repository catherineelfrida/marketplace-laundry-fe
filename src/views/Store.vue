<template>
  <!-- Modal -->
  <div class="modal fade" id="modalService" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">{{ modal.title }}</h1>
          <font-awesome-icon icon="fa-solid fa-xmark" role="button" @click="closeModal()"/>
        </div>
        <div class="modal-body p-0" style="overflow-y: auto; max-height: 380px;">
          <div 
            v-for="(service, index) in modal.services" 
            :key="service.id"
            class="px-3 py-2 d-flex justify-content-between" 
            :class="{'bg-gray-100' : index % 2 === 0}"
          >
            <div>
              <p class="ms-2 mb-0 text-dark text-xl">
                {{ service.service_item.item_name }}
                <span class="text-danger text-xs">{{ "Rp " + service.rate }}</span>
              </p>
              <p class="ms-2 mb-0 text-secondary text-xxs">{{ service.service_type.service_name }}</p>
              <p class="ms-2 mb-2 text-secondary text-xxs">{{ `${service.service_duration.duration_name} (${service.service_duration.hour})` }}</p>
            </div>
            <div class="d-flex my-auto">
              <input 
                type="text" 
                class="form-control text-xs" 
                placeholder="note" 
                style="height: 30px; width: 150px;"
                v-model="service.note"
              >
              <font-awesome-icon class="my-auto mx-2 ms-4" icon="fa-solid fa-minus" role="button" @click="countQuantity(index, false)"/>
              <p class="my-auto mx-2">{{ service.quantity }}</p>
              <font-awesome-icon class="my-auto mx-2" icon="fa-solid fa-plus" role="button" @click="countQuantity(index, true)"/>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="order()">Order</button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row justify-content-between">
      <div class="col-lg-4 col-md-6 col-xxl-3 col-12">
        <argon-input
          class="text-xs"
          placeholder="Search ..."
          v-model:value="filter.search"
        />
      </div>
      <div class="col-xxl-3 col-md-4 col-12">
        <select class="form-select text-bold" v-model="filter.value">
          <option v-for="(item, index) in filter.detail" :key="index" :value="item">{{ item }}</option>
        </select>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row">
        <div 
          class="col-lg-4 col-md-6 col-xxl-3 col-12 mb-3" 
          v-for="store in comSearch" :key="store.id"
          :data-bs-toggle="store.service && store.service.length > 0 ? 'modal' : null"
          :data-bs-target="store.service && store.service.length > 0 ? '#modalService' : null"
          @click="openModal(store.id, store.store_name, store.service)"
        >
          <div class="card">
            <div class="card-header pb-1">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0" >{{ store.store_name }}</h6>
                <div class="d-flex">
                  <font-awesome-icon class="text-xs" icon="fa-solid fa-location-dot" role="button"/>
                  <span class="text-xs ms-1">{{ formattedDistance(store.distanceValue) }}</span>
                </div>
              </div>
              <p class="text-xs mb-0 text-danger">{{ 
                store.service && store.service.length > 0 ? "Start From " + store.service[0].rate : 'No service available'
              }}</p>
            </div>
            <div class="card-body pt-1">
              <p class="text-xs mb-2">
                Address: 
                <span class="text-dark font-weight-bold">{{ store.address }}</span>
              </p>
              <p class="text-xs mb-2">
                Telephone: 
                <span class="text-dark font-weight-bold">{{ store.telephone }}</span>
              </p>
              <p class="text-xs mb-2">
                Oprational: 
                <span class="text-dark font-weight-bold">{{ 
                  store.open_time.split(":").slice(0,-1).join(":")
                  + " - " + 
                  store.close_time.split(":").slice(0,-1).join(":")
                }}</span>
              </p>
            </div>
          </div>
        </div>
        
    </div>
  </div>

  <argon-pagination class="bg-primary justify-content-end my-2 mx-3">
    <argon-pagination-item v-if="filter.page.now > 1" prev @click="changePage(false, false)" />
    <argon-pagination-item 
      v-for="(page, index) in listPage" 
      :key="index" 
      :label="page" 
      :active="page === filter.page.now" 
      @click="changePage(true, page)"
    />
    <argon-pagination-item v-if="filter.page.now < filter.page.total" next @click="changePage(false, true)" />
  </argon-pagination>
</template>

<script>
import axios from 'axios';
import bootstrap from 'bootstrap/dist/js/bootstrap';
import ArgonInput from '../components/ArgonInput.vue';
import ArgonPagination from '../components/ArgonPagination.vue';
import ArgonPaginationItem from '../components/ArgonPaginationItem.vue';

export default {
  name: "Store",
  data() {
    return {
      auth: {
        token: localStorage.getItem("token"),
        profileId: localStorage.getItem("profileId"),
        storeId: localStorage.getItem("storeId"),
        role: parseInt(localStorage.getItem("role"))
      },
      config: {
        url: process.env.VUE_APP_URL_DEVELOPER,
        endpointV1: process.env.VUE_APP_ENDPOINT_V1,
        headers: {"Content-Type": "application/json"}
      },
      filter: {
        search: "",
        value: "Cheap",
        page: {
          total: 1,
          now: 1,
        },
        detail: [
          "Cheap",
          "Nearest"
        ]
      },
      stores: [],
      modal: {
        title: "",
        idStore: "",
        services: [],
        total: 0
      }
    }
  },
  
  components: {
    ArgonInput,
    ArgonPagination,
    ArgonPaginationItem
  },

  created() {
    const auth = this.auth
    const token = auth.token
    if (!token) this.$router.push({name: "Signin"})
    if (auth.profileId === '0' ) this.$router.push({name: "Profile"})

    this.config.headers.authorization = token
  },

  async mounted() {
    await this.getAllStore()
  },

  methods: {
    createNotif(type, text, duration = 3000){
      this.$notify({
        type: type,
        duration: duration,
        text: text,
      })
    },

    openModal(idStore, storeName, detailService){
      if (!detailService.length) return 
      const modal = this.modal
      modal.title = "Service " + storeName
      modal.idStore = idStore
      const newDataService = detailService.map( service => {
        return {
          ...service,
          quantity: 0,
          note: ""
        }
      })
      modal.services = newDataService
    },

    formattedDistance(number) {
      if (number > 1000) {
        return (number/1000).toFixed(1) + " km"
      }
      return number + " m"
    },

    closeModal() {
      const docModal = document.querySelector('#modalService');
      const modalService = bootstrap.Modal.getInstance(docModal)
      modalService.hide()
    },

    countQuantity(index, count) {
      const service = this.modal.services[index]
      if (count) {
        service.quantity += 1
      } else if (service.quantity > 0) {
        service.quantity -= 1
      } 
    },

    async getAllStore(){
      try {
        const objConfig = this.config
        let configAllStore = {
          method: 'GET',
          url: objConfig.url + objConfig.endpointV1 + "stores",
          headers: objConfig.headers
        }

        const data = await axios(configAllStore)
        const dataStores = data.data.data
        this.stores = dataStores
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error")
        }
      }
    },

    async order() {
      try {
        const objConfig = this.config
        const modal = this.modal
        const dataOrders = modal.services.filter(order => order.quantity > 0)
        if (!dataOrders.length) {
          const error = new Error("Add one item to continue the transaction")
          error.status = 400
          throw error
        }
        const transactionDetail = dataOrders.map( trx => {
          return {
            service_id: trx.id,
            quantity: trx.quantity,
            note: trx.note || "-"
          }
        })

        const configTransaction = {
          method: 'POST',
          url: objConfig.url + objConfig.endpointV1 + "stores/" + modal.idStore + "/transactions",
          headers: objConfig.headers,
          data: { transaction_detail: transactionDetail }
        }

        await axios(configTransaction)
        this.createNotif("success","Your transaction has been successful") 
        this.closeModal()
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === 400) {
          this.createNotif("error", error.message)
        } else if (codeError === "ERR_BAD_REQUEST"){
          const errRes = error.response.data.message
          this.createNotif("error", errRes)
        }else if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error")
        }
      }
    },
  },

  computed: {
    comSearch() {
      const filter = this.filter
      const search = filter.search
      const indexFilter = filter.detail.indexOf(filter.value)
      const page = filter.page.now
      const totalDataShow = 12
      const stores = this.stores
      const nearestStore = [...stores].sort((a, b) => {
        if (a.distanceValue < b.distanceValue) return -1;
        if (a.distanceValue > b.distanceValue) return 1;
        return 0;
      })

      const data = indexFilter ? nearestStore : stores

      // search and filter
      const listDataFilter = data.filter((strs) => {
        return strs.store_name.match(search)
      })

      // page show
      const jumlahPage = Math.ceil(listDataFilter.length / totalDataShow) || 1
      const indexFirstDataShow = (page - 1) * totalDataShow
      const indexLastDataShow = (page * totalDataShow) - 1
      filter.page.total = jumlahPage

      return listDataFilter.filter((data, index) => {
        if (index >= indexFirstDataShow && index <= indexLastDataShow) {
          return data
        }
      })
    },

    listPage(){
        const page = this.filter.page
        const pageNow = page.now
        const pageTotal = page.total
        console.log(pageTotal);
        let listPage = []

        if (pageNow === 1) {
          listPage = pageTotal !== 1 ? [pageNow, pageNow + 1] : []
        } else if (pageNow === pageTotal) {
          listPage = [pageTotal - 1 , pageTotal]
        } else {
          listPage = [pageNow - 1, pageNow , pageNow + 1]
        }

        return listPage
      }
  }
};
</script>
