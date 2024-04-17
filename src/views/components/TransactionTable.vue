<template>
  <!-- Modal -->
  <div class="modal fade" id="transaction" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Detail Transaction</h1>
          <font-awesome-icon icon="fa-solid fa-xmark" role="button" data-bs-dismiss="modal" aria-label="Close"/>
        </div>
        <div class="modal-body">
          <div class="card border border-black mb-3">
            <div class="card-body p-3">
              <div class="row">
                <div class="col">
                  <p class="mb-1 text-sm text-secondary">
                    Customer : 
                    <span class="text-dark font-weight-bolder">
                      {{ modal.customer.name }}
                    </span>
                  </p>
                  <p class="mb-1 text-sm text-secondary">
                    Telephone : 
                    <span class="text-dark font-weight-bold">
                      {{ modal.customer.telephone }}
                    </span>
                  </p>
                  <p class="mb-1 text-sm text-secondary">
                    Order : 
                    <span class="text-dark font-weight-bolder">
                      {{ formatDate(modal.order.start) }}
                    </span>
                  </p>
                </div>
                <div class="col">
                  <p class="mb-1 text-sm text-secondary">
                    Finish : 
                    <span class="text-dark font-weight-bold">
                      {{ formatDate(modal.order.end) }}
                    </span>
                  </p>
                  <p class="mb-1 text-sm text-secondary">
                    Payment : 
                    <span class="text-dark font-weight-bold">
                      {{ modal.transaction.status.value }}
                    </span>
                  </p>
                  <p class="mb-1 text-sm text-secondary">
                    Status : 
                    <span class="text-dark font-weight-bold">
                      {{ modal.order.status.value }}
                    </span>
                  </p>
                </div>
              </div>
              
            </div>
            <div class="card border border-black">
            <div class="card-body p-3">
              <h6 class="text-center mb-0">Order</h6>
              <hr class="horizontal dark mt-1">
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
                <p>Total : </p>
                <p class="text-dark font-weight-bold me-3">{{ formatRp(modal.transaction.total, true) }}</p>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div v-if="modal.order.status.value !== 'EXPIRED'" class="modal-footer d-flex justify-content-between">
          <argon-button 
            size="md" 
            variant="contained" 
            :color="modal.transaction.status.color" 
            :disabled="modal.transaction.status.value === 'PAID'"
            @click="pay()"
          >
            {{ modal.transaction.status.value === "PAID" ? "PAID" : "Change Status Payment" }}
          </argon-button>
          <argon-button 
            size="md" 
            variant="contained" 
            :color="modal.order.status.color" 
            :disabled="modal.order.status.value === 'READY_FOR_PICKUP' || modal.order.status.value === 'COMPLETED'"
            @click="changeStatusOrder()"
          >
            {{ modal.order.status.value === "READY_FOR_PICKUP" ? "Ready For Pickup" : modal.order.status.value === "COMPLETED" ? "Completed" : "Change Status Order" }}
          </argon-button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header pb-0">
      <div class="row">
        <div class="col-lg-6 col-md-3 col-sm-6 col-12 d-flex h-50 mb-3">
          <h6>Transaction</h6>
          <argon-button
            size="xs" 
            variant="contained" 
            :color="transactions.length === 0 ? 'secondary' : 'warning'" 
            class="cursor-pointer ms-2"
            :disabled="transactions.length === 0"
            @click="report()"
          >Rekap</argon-button>
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
    <div class="card-body">
      <div class="table-responsive p-0">
        <table class="table">
          <thead>
            <tr>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-1">No</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nama</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Detail</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Order Date</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Finish Date</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Total</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">payment Status</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(data, index) in comSearch" 
              :key="data.id"
              :class="{'bg-gray-100' : index % 2 === 0}"
            >
              <td><p class="text-xs text-center font-weight-bold mb-0">{{ index+1 }}</p></td>
              <td><h6 class="text-sm ps-3">{{ data.customer.profile.name }}</h6></td>
              <td>
                <ul class="text-xs mb-1">
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
              <td><p class="text-xxs text-center font-weight-bold mb-0">{{ data.status.split("_").join(" ") }}</p></td>
              <td><p class="text-xs text-center font-weight-bold mb-0">
                <argon-button 
                  size="xs" 
                  variant="contained" 
                  color="warning" 
                  class="cursor-pointer"
                  data-bs-toggle="modal" 
                  data-bs-target="#transaction"
                  @click="openModal(index, data.id, data.start_date, data.end_date, data.status, data.payment_status, data.total, data.customer.profile, data.transaction_detail)"
                >Edit</argon-button>
              </p></td>
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
// import ArgonBadge from '../../components/ArgonBadge.vue'
import ArgonButton from '../../components/ArgonButton.vue'
// import ArgonCheckbox from '../../components/ArgonCheckbox.vue';


export default {
    name: 'trancation-table',
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
        transactions: [],
        modal: {
          customer: {
            name: "",
            telephone: ""
          },
          order: {
            index: null,
            start: "",
            end: "",
            status: {
              value: "",
              color: ""
            }
          },
          transaction: {
            id: "",
            total: 0,
            detail: [],
            status: {
              value: "",
              color: "",
            },
          }
        }
      }
    },
    components: {
      ArgonInput,
      ArgonPagination,
      ArgonPaginationItem,
      // ArgonBadge,
      ArgonButton,
      // ArgonCheckbox
    },

    created() {
      const token = this.auth.token
      if (!token) this.$router.push({name: "Signin"})

      this.config.headers.authorization = token
    },

    async mounted() {
      await this.getAllTrancation()
    },

    methods: {
      createNotif(type, text, duration = 3000){
        this.$notify({
          type: type,
          duration: duration,
          text: text,
        })
      },

      changePage(isPage, data){
        if (isPage) {
          this.filter.page.now = data
        } else {
          this.filter.page.now = data ? this.filter.page.now + 1 : this.filter.page.now - 1
        }
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

      formatStatus(value, isOrderStatus){
        let color = ""
        const objOrder = {
          EXPIRED: "secondary",
          PENDING_DELIVERY: "warning",
          PENDING_PROCESSING: "info",
          IN_PROGRESS: "primary",
          READY_FOR_PICKUP: "success",
          COMPLETED: "secondary"
        }

        if (isOrderStatus){
          color = objOrder[value]
        } else {
          color = value === 'PAID' ? "secondary" : "warning"
        }
        return color
      },

      formatRp(nominal, isWithRp = false) {
        const styleFormat = isWithRp ? 'currency' : 'decimal';
        const formatter =  new Intl.NumberFormat('id-ID', { style: styleFormat, currency: 'IDR' }).format(nominal);
        return formatter
      },

      openModal(index, idTransaction, laundryStart, laundryEnd, orderStatus, paymentStatus, total, customer, detailTransactions){
        const modal = this.modal
        const dataCustomer = modal.customer
        const dataTransaction = modal.transaction
        const dataOrder = modal.order

        dataCustomer.name = customer.name
        dataCustomer.telephone = customer.telephone

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

        console.log(this.transactions.length);
      },

      closeModal() {
        const docModal = document.querySelector('#transaction');
        const modalService = bootstrap.Modal.getInstance(docModal)
        modalService.hide()
      },

      async getAllTrancation() {
        try {
          const objConfig = this.config
          const configGetAll = {
            method: "GET",
            url: objConfig.url + objConfig.endpointV1 + 'transactions',
            headers: objConfig.headers
          }
          const data = await axios(configGetAll)
          const dataGet = data.data.data
          this.transactions = dataGet
        } catch (error) {
          const codeError = error.code || error.status
          if (codeError === "ERR_NETWORK") {
            this.createNotif("error", "Service Error, get transaction failed")
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
          const dataTransactions = this.transactions
          const status = order.status.value
          const arrOrderStatus = [ "EXPIRED", "PENDING_DELIVERY", "PENDING_PROCESSING", "IN_PROGRESS", "READY_FOR_PICKUP", "COMPLETED" ]
          const indexStatus = arrOrderStatus.indexOf(status)
          const index = dataTransactions.findIndex(trx => trx.id === id);

          let error = null 
          if (indexStatus === arrOrderStatus.length - 1) error = new Error("Order status is complete")
          if (indexStatus === arrOrderStatus.length - 2) error = new Error("Order status  can only be changed by the customer")
          if (error) {
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
          this.transactions[index].status = newStatus
          this.createNotif("success", "Successfully change status order")
          this.closeModal()
        } catch (error) {
          console.log(error.message);
          const codeError = error.code || error.status
          if (codeError === "ERR_NETWORK") {
            this.createNotif("error", "Service Error, Change status order failed")
          } else if (codeError === 400){
            this.createNotif("error", error.message)
          }
        }
      },

      async pay() {
        try {
          const objConfig = this.config
          const modal = this.modal
          const index = modal.order.index
          const transaction = modal.transaction
          const id = transaction.id
          const status = transaction.status.value
          const newStatus = "PAID"

          if (status === newStatus) {
            const error = new Error("Transaction has been paid")
            error.status = 400
            throw error
          }

          const configPay = {
            method: 'PATCH',
            url: objConfig.url + objConfig.endpointV1 + "transactions/" + id,
            headers: objConfig.headers,
            data: {
              payment_status: newStatus
            }
          }

          await axios(configPay)
          this.transactions[index].payment_status = newStatus
          this.createNotif("success", "Successfully change status transaction")
          this.closeModal()
        } catch (error) {
          console.log(error.message);
          const codeError = error.code || error.status
          if (codeError === "ERR_NETWORK") {
            this.createNotif("error", "Service Error, Create Sub Service Item Failed")
          } else if (codeError === 400) {
            this.createNotif("error", error.message)
          }
        }
      },

      async report() {
        try {
          const objConfig = this.config
          if (!this.transactions.length) {
            const error = new Error("There are no transactions to recap")
            error.status = 400
            throw error
          }

          const configReport = {
            method: 'GET',
            url: objConfig.url + objConfig.endpointV1 + "report",
            headers: objConfig.headers,
            responseType: 'arraybuffer' 
          }
          const data = await axios(configReport)
          const blob = new Blob([data.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob); 
          window.open(url);

          console.log("Success get report!!");
          
        } catch (error) {
          console.log(error.message);
          const codeError = error.code || error.status
          if (codeError === "ERR_NETWORK") {
            this.createNotif("error", "Service Error, Something is wrong")
          } else if (codeError === 400) {
            this.createNotif("error", error.message)
          }
        }
      }
    },

    computed: {
      comSearch(){
        const filter = this.filter
        const search = filter.search
        const filterValue = filter.value.split(" ").join("_").toLocaleUpperCase()
        const filterPay = filter.pay.toLocaleUpperCase()
        const page = filter.page.now
        const transactions = this.transactions
        const totalDataShow = 10

        // search and filter
        let listDataFilter = transactions.filter((trx) => {
          if (filterValue && trx.status === filterValue){
            return trx.customer.profile.name.match(search)
          } else if (!filterValue) {
            return trx.customer.profile.name.match(search)
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
}
</script>