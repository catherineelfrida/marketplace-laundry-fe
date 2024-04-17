<template>
  <!-- Modal -->
  <div class="modal fade" id="order" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Detail Transaction</h1>
          <font-awesome-icon icon="fa-solid fa-xmark" role="button" data-bs-dismiss="modal" aria-label="Close"/>
        </div>
        <div class="modal-body">
          <div class="card border border-black mb-3">
            <div class="card-body p-3">
              <p class="mb-1 text-sm text-secondary">
                Laundry : 
                <span class="text-dark font-weight-bolder">
                  {{ modal.store.name }}
                </span>
              </p>
              <p class="mb-1 text-sm text-secondary">
                Address : 
                <span class="text-dark font-weight-bold">
                  {{ modal.store.address }}
                </span>
              </p>
              <p class="mb-1 text-sm text-secondary">
                Telephone : 
                <span class="text-dark font-weight-bold">
                  {{ modal.store.telephone }}
                </span>
              </p>
              <p class="mb-1 text-sm text-secondary">
                Operational : 
                <span class="text-dark font-weight-bold">
                  {{ modal.store.open + "-" + modal.store.close }}
                </span>
              </p>
            </div>
          </div>
          <div class="card border border-black">
            <div class="card-body p-3">
              <div class="row">
                <div class="col">
                  <p class="mb-1 text-xs text-secondary">
                    Order : 
                    <span class="text-dark font-weight-bolder">
                      {{ formatDate(modal.order.start) }}
                    </span>
                  </p>
                  <p class="mb-1 text-xs text-secondary">
                    Finish : 
                    <span class="text-dark font-weight-bold">
                      {{ formatDate(modal.order.end) }}
                    </span>
                  </p>
                </div>
                <div class="col">
                  <p class="mb-1 text-xs text-secondary">
                    Status Payment : 
                    <span class="text-dark font-weight-bolder">
                      {{ modal.transaction.status.value }}
                    </span>
                  </p>
                  <p class="mb-1 text-xs text-secondary">
                    Status : 
                    <span class="text-dark font-weight-bold">
                      {{ modal.order.status.value.split("_").join(" ") }}
                    </span>
                  </p>
                </div>
              </div>
              <hr class="horizontal dark">
              <div style="overflow-y: auto; max-height: 280px;">
                <div
                  v-for="trx in modal.transaction.detail" 
                  :key="trx.id"
                >
                  <div class="d-flex justify-content-between">
                    <div>
                      <p class="mb-0 text-sm">
                        {{ trx.service.service_item.item_name }}
                        <span class="text-xs text-secondary">{{ `(${trx.service.service_type.service_name}, ${trx.service.service_duration.duration_name})` }}</span>
                      </p>
                      <p class="mb-0 text-xs">
                        Note: {{ trx.note }}
                      </p>
                    </div>
                    <div class="my-auto me-3">
                      <p class="mb-0 text-sm">{{ `${formatRp(trx.service.rate)} x ${trx.quantity} : ${formatRp(trx.amount)}` }}</p>
                    </div>
                  </div>
                  <hr class="my-2">
                </div>
              </div>
              <div class="d-flex justify-content-between">
                <p>Total</p>
                <p class="text-dark font-weight-bold me-3">{{ formatRp(modal.transaction.total, true) }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer justify-content-end">
          <argon-button 
            size="md" 
            variant="contained" 
            :disabled="modal.order.status.value === 'COMPLETED'"
            :color="modal.order.status.value === 'READY_FOR_PICKUP' ? 'warning' : 'secondary'"
            v-if="modal.order.status.value === 'READY_FOR_PICKUP' || modal.order.status.value === 'COMPLETED'"
            @click="changeStatusOrder()"
          >
            {{ buttonText() }}
          </argon-button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header pb-0">
      <div class="row">
        <div class="col-lg-6 col-md-3 col-sm-6 col-12">
          <h6>Order</h6>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6 col-12">
          <argon-input
            class="text-xs"
            size="sm"
            placeholder="Search name..."
            v-model:value="filter.search"
          />
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6 col-12 mb-3">
          <select class="form-select text-bold text-xs" v-model="filter.value">
            <option :value="''">Order No Filter</option>
            <option v-for="(item, index) in filter.detail" :key="index" :value="item">{{ "Order " + item }}</option>
          </select>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6 col-12">
          <select class="form-select text-bold text-xs" v-model="filter.pay">
            <option :value="''">Transaction No Filter</option>
            <option v-for="(item, index) in filter.statusPay" :key="index" :value="item">{{ "Transaction " + item }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive p-0">
        <table class="table">
          <thead>
            <tr>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">No</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Store</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Detail</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Order Date</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Finish Date</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Total</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">payment Status</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
            </tr>
          </thead>
          <tbody >
            <tr 
              v-for="(data, index) in comSearch" 
              :key="data.id"
              :class="{'bg-gray-100' : index % 2 === 0}"
              data-bs-toggle="modal" 
              data-bs-target="#order"
              @click="openModal(index, data.id, data.start_date, data.end_date, data.status, data.payment_status, data.total, data.store, data.transaction_detail)"
            >
              <td><p class="text-xs text-center font-weight-bold mb-0">{{ index+1 }}</p></td>
              <td><h6 class="text-sm ps-3">{{ data.store.store_name }}</h6></td>
              <!-- detail -->
              <td> 
                <ul class="text-xs ps-3">
                  <li 
                    v-for="trx in data.transaction_detail" 
                    :key="trx.id"
                  >
                    <p class="text-xs mb-1">
                      Servi: 
                      <span class="text-dark font-weight-bold">
                        {{ 
                          trx.service.service_item.item_name + " + " +
                          trx.service.service_type.service_name + " + " +
                          trx.service.service_duration.duration_name
                        }}
                      </span>
                    </p>
                    <p class="text-xs mb-1">
                      Note: 
                      <span class="text-dark font-weight-bold">
                        {{ 
                          trx.note 
                        }}
                      </span>
                    </p>
                    <p class="text-xs mb-1">
                      Price: 
                      <span class="text-dark font-weight-bold">
                        {{ 
                          trx.service.rate + " + " +
                          trx.quantity + " = " +
                          trx.amount
                        }}
                      </span>
                    </p>
                  </li>
                </ul>
              </td>
              <td><p class="text-xs text-center font-weight-bold mb-0">{{ formatDate(data.start_date) }}</p></td>
              <td><p class="text-xs text-center font-weight-bold mb-0">{{ formatDate(data.end_date) }}</p></td>
              <td><p class="text-xs ps-3 font-weight-bold mb-0">{{ data.total }}</p></td>
              <td><p class="text-xxs text-center font-weight-bold mb-0">{{ data.payment_status }}</p></td>
              <td><p class="text-xxs text-center font-weight-bold mb-0 px-3">{{ data.status.split("_").join(" ") }}</p></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <argon-pagination>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import bootstrap from 'bootstrap/dist/js/bootstrap';
import ArgonInput from '../../components/ArgonInput.vue';
import ArgonPagination from '../../components/ArgonPagination.vue'
import ArgonPaginationItem from '../../components/ArgonPaginationItem.vue'
import ArgonButton from '../../components/ArgonButton.vue'
// import ArgonBadge from '../../components/ArgonBadge.vue';

export default {
    name: 'order-table',
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
        filter: {
          search: "",
          value: "",
          pay: "",
          page: {
            total: 1,
            now: 1,
          },
          detail: [
            "Expired",
            "Pending Delivery",
            "Pending Processing",
            "In Progress",
            "Ready For Pickup",
            "Completed",
          ],
          statusPay: [
            "Paid",
            "Unpaid"
          ]
        },
        orders: [],
        modal: {
          store: {
            name: "",
            address: "",
            telephone: "",
            open: "",
            close: ""
          }, 
          order: {
            index: null,
            start: "",
            end: "",
            status: {
              value: "",
              color: "",
            },
          },
          transaction: {
            id: "",
            total: 0,
            status: {
              value: "",
              color: "",
            },
            detail: []
          }
        },
      }
    },
    components: {
      ArgonInput,
      ArgonPagination,
      ArgonPaginationItem,
      ArgonButton,
      // ArgonBadge
    },

    created() {
      const token = this.auth.token
      if (!token) this.$router.push({name: "Signin"})

      this.config.headers.authorization = token
    },

    async mounted() {
      await this.getAllOrder()
    },

    methods: {
      createNotif(type, text, duration = 3000){
        this.$notify({
          type: type,
          duration: duration,
          text: text,
        })
      },

      buttonText(){
        const status = this.modal.order.status.value
        if (status === "READY_FOR_PICKUP") {
          return "Complite The Order"
        } else if (status === "COMPLETED") {
          return "Order Completed"
        } else {
          return status
        }
      },

      changePage(isPage, data){
        if (isPage) {
          this.filter.page.now = data
        } else {
          this.filter.page.now = data ? this.filter.page.now + 1 : this.filter.page.now - 1
        }
      },

      openModal(index, idTransaction, laundryStart, laundryEnd, orderStatus, paymentStatus, total, store, detailTransactions) {
        const modal = this.modal
        const dataStore = modal.store
        const dataTransaction = modal.transaction
        const dataOrder = modal.order

        dataStore.name = store.store_name
        dataStore.address = store.address
        dataStore.telephone = store.telephone
        dataStore.open = store.open_time
        dataStore.close = store.close_time

        dataOrder.index = index
        dataOrder.start = laundryStart
        dataOrder.end = laundryEnd
        dataOrder.status.value = orderStatus
        dataOrder.status.color = this.formatStatus(orderStatus, true)
        
        dataTransaction.id = idTransaction
        dataTransaction.detail = detailTransactions
        dataTransaction.total = total
        dataTransaction.status.value = paymentStatus
        dataTransaction.status.color = this.formatStatus(paymentStatus, false)
      },

      closeModal() {
        const docModal = document.querySelector('#order');
        const modalService = bootstrap.Modal.getInstance(docModal)
        modalService.hide()
      },

      formatDate(date){
        if (!date) return "-"
        const tgl = new Date(date)
        const formatter = new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        return formatter.format(tgl)
      },

      formatRp(nominal, isWithRp = false) {
        const styleFormat = isWithRp ? 'currency' : 'decimal';
        const formatter =  new Intl.NumberFormat('id-ID', { style: styleFormat, currency: 'IDR' }).format(nominal);
        return formatter
      },

      formatStatus(value, isOrderStatus){
        let color = ""
        const objOrder = {
          EXPIRED: "danger",
          PENDING_DELIVERY: "warning",
          PENDING_PROCESSING: "info",
          IN_PROGRESS: "primary",
          READY_FOR_PICKUP: "success",
          COMPLETED: "secondary"

        }
        if (isOrderStatus){
          color = objOrder[value]
        } else {
          color = value === 'PAID' ? "success" : "danger"
        }
        return color
      },
      
      async getAllOrder() {
        try {
          const objConfig = this.config
          const configGetAll = {
            method: "GET",
            url: objConfig.url + objConfig.endpointV1 + 'transactions',
            headers: objConfig.headers
          }
          const data = await axios(configGetAll)
          const dataGet = data.data.data
          this.orders = dataGet
        } catch (error) {
          const codeError = error.code || error.status
          if (codeError === "ERR_NETWORK") {
            this.createNotif("error", "Service Error, Create Sub Service Item Failed")
          }
        }
      },

      async changeStatusOrder() {
        try {
          const objConfig = this.config
          const modal = this.modal
          const order = modal.order
          const id = modal.transaction.id
          // const index = order.index
          const dataOrder = this.orders
          const status = order.status.value
          const arrOrderStatus = [ "EXPIRED", "PENDING_DELIVERY", "PENDING_PROCESSING", "IN_PROGRESS", "READY_FOR_PICKUP", "COMPLETED" ]
          const indexStatus = arrOrderStatus.indexOf(status)
          const index = dataOrder.findIndex(order => order.id === id);


          if (indexStatus === arrOrderStatus.length - 1) {
            const error = new Error("Order status is complete")
            error.status = 400
            throw error
          }

          const newStatus = arrOrderStatus[indexStatus + 1]
          const configUpdate = {
            method: 'PUT',
            url: objConfig.url + objConfig.endpointV1 + "transactions/" + id,
            headers: objConfig.headers,
            data: {
              status: newStatus
            }
          }

          await axios(configUpdate)

          this.orders[index].status = newStatus
          this.createNotif("success", "Successfully change status order")
          this.closeModal()
        } catch (error) {
          console.log(error.message);
          const codeError = error.code || error.status
          console.log(codeError);
          if (codeError === "ERR_NETWORK") {
            this.createNotif("error", "Service Error, Create Sub Service Item Failed")
          } else if (codeError === "ERR_BAD_REQUEST") {
            const err = error.response.data
            this.createNotif("error", err.message)
          } if (codeError === 400){
            this.createNotif("error", error.message)
          }
        }
      },

    },

    computed: {
      comSearch() {
        const filter = this.filter
        const search = filter.search
        const filterValue = filter.value.split(" ").join("_").toLocaleUpperCase()
        const filterPay = filter.pay.toLocaleUpperCase()
        const page = filter.page.now
        const orders = this.orders
        const totalDataShow = 10

        // search and filter
        let listDataFilter = orders.filter((ord) => {
          if (filterValue && ord.status === filterValue){
            return ord.store.store_name.match(search)
          } else if (!filterValue) {
            return ord.store.store_name.match(search)
          }
        })

        // payment status 
        if (filterPay) {
          listDataFilter = listDataFilter.filter((ord) => ord.payment_status === filterPay);
        }

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
}
</script>