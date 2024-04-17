<template>
  <!-- Modal -->
  <div class="modal fade" id="sellerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">{{ modal.title }}</h1>
          <font-awesome-icon icon="fa-solid fa-xmark" role="button" data-bs-dismiss="modal" aria-label="Close" @click="closeModal()"/>
        </div>
        <div class="modal-body">
          <div class="form-floating mb-3">
            <input 
              type="text" 
              class="form-control" 
              v-model="modal.name.value"
              :class="{'is-invalid': modal.name.isInvalid}"
              id="floatingInput" 
              placeholder="Name"
            >
            <label for="floatingInput">Name</label>
          </div>
          <div class="form-floating mb-3">
            <input 
              type="text" 
              class="form-control" 
              v-model="modal.address.value"
              :class="{'is-invalid': modal.address.isInvalid}"
              id="floatingInput" 
              placeholder="Address"
            >
            <label for="floatingInput">Address</label>
          </div>
          <div class="form-floating mb-3">
            <input 
              type="text" 
              class="form-control" 
              v-model="modal.telephone.value"
              :class="{'is-invalid': modal.telephone.isInvalid}"
              id="floatingInput" 
              placeholder="Telephone"
            >
            <label for="floatingInput">Telephone</label>
          </div>
          <div class="form-floating mb-3">
            <input 
              type="time"
              step="3600" 
              class="form-control" 
              v-model="modal.openTime.value"
              :class="{'is-invalid': modal.openTime.isInvalid}"
              id="floatingInput" 
              placeholder="Open"
            >
            <label for="floatingInput">Open</label>
          </div>
          <div class="form-floating mb-3">
            <input 
              type="time"
              step="3600" 
              class="form-control" 
              v-model="modal.closeTime.value"
              :class="{'is-invalid': modal.closeTime.isInvalid}"
              id="floatingInput" 
              placeholder="Close"
            >
            <label for="floatingInput">Close</label>
          </div>
          <fieldset disabled v-if="modal.type" >
              <div class="form-floating">
                <input 
                  type="text" 
                  class="form-control disabled" 
                  v-model="modal.username.value"
                  :class="{'is-invalid': modal.username.isInvalid}"
                  id="floatingInput" 
                  placeholder="Username"
                >
                <label for="floatingInput">Username</label>
              </div>
          </fieldset>
          <div 
            id="app" 
            class="input-group mb-3"
            v-else
          >
            <select 
                class="form-select text-bold" 
                id="inputGroupSelect01" 
                v-model="modal.username.value" 
                :class="{ 'border-danger':modal.username.isInvalid }"
            >
              <option disabled :selected="modal.username.value === ''" :value="''" >Select Seller</option>
              <option v-for="(user, index) in userWithNoProfile()" :key="index" :value="user.username">{{ user.username }}</option>
            </select>
          </div>
        </div>
        <div 
          class="modal-footer"
          :class="{'d-flex justify-content-between' : modal.type}"
        >
          <button v-if="modal.type === 1" type="button" class="btn btn-danger" @click="deleteSeller()">Delete</button>
          <button type="button" class="btn btn-success" @click="manageButtonCU()">{{ modal.type ? "Update" : "Create" }}</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header pb-0">
        <div class="d-flex justify-content-between px-2">
            <h6>Seller table</h6>
            <font-awesome-icon icon="fa-solid fa-plus" role="button" class="mt-1"  data-bs-toggle="modal" data-bs-target="#sellerModal" @click="openModal(0)"/>
        </div>
        <argon-input
            class="text-xs"
            size="sm"
            placeholder="Search username ..."
            v-model:value="filter.search"
        />
    </div>
    <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
            <table class="table align-items-center mb-0">
                <thead>
                    <tr>
                        <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Seller</th>
                        <th class="text-end text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(data, index) in comSearch" 
                        :key="index"
                        :class="{'bg-gray-100' : index % 2 === 0}"
                    >
                        <td class="px-4">
                            <p class="text-sm font-weight-bold mb-0 ">{{ data.name }}</p>
                            <p class="text-xxs text-secondary mb-0">{{ cutAdress(data.address) }}</p>
                            <p class="text-xxs text-secondary mb-0">{{ data.phone }}</p>
                            <p class="text-xxs text-secondary mb-0">{{ cutTime(data.openTime) + " - " + cutTime(data.closeTime) }}</p>
                        </td>
                        <td class="align-middle text-end px-4">
                            <a
                            href="javascript:;"
                            class="text-secondary font-weight-bold text-xs"
                            data-toggle="tooltip"
                            data-original-title="Edit user"
                            data-bs-toggle="modal" 
                            data-bs-target="#sellerModal"
                            @click="openModal(1, index, data)"
                            >Edit</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="card-footer d-flex justify-content-center">
        <argon-pagination>
        <argon-pagination-item v-if="filter.page.now > 1" prev @click="changePage(false, false)"/>
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
import ArgonInput from '../../components/ArgonInput.vue'
import ArgonPagination from '../../components/ArgonPagination.vue';
import ArgonPaginationItem from '../../components/ArgonPaginationItem.vue';
import bootstrap from "bootstrap/dist/js/bootstrap"
import axios from 'axios';

export default {
    name: "seller-table",
    components: {
        ArgonInput,
        ArgonPagination,
        ArgonPaginationItem
    },
    data(){
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
                page: {
                    total: 1,
                    now: 1
                }
            }, 
            modal: {
                type: null,
                title: "",
                index: null,
                name: {
                    value: "",
                    isInvalid: false
                },
                address: {
                    value: "",
                    isInvalid: false
                },
                telephone: {
                    value: "",
                    isInvalid: false
                },
                openTime: {
                    value: "",
                    isInvalid: false
                },
                closeTime: {
                    value: "",
                    isInvalid: false
                },
                username: {
                    value: "",
                    isInvalid: false
                },
            },
            sellers: [],
            users: []
        }   
    },
    created(){
        const token = this.auth.token
        if (!token) this.$router.push({name: "Signin"})
        this.config.headers.authorization = token
    },
    async mounted() {
        await this.getAllSeller()
    },
    methods: {
        createNotif(type, text, duration = 3000){
            this.$notify({
                type: type,
                duration: duration,
                text: text,
            })
        },

        openModal(type, index = null, data = null){
            const modal = this.modal
            modal.type = type
            modal.title = type ? "Edit user" : "Create user"
            
            if (type) {
                modal.index = index
                modal.id = data.id
                modal.name.value = data.name
                modal.address.value = data.address
                modal.telephone.value = data.phone
                modal.openTime.value = this.cutTime(data.openTime)
                modal.closeTime.value = this.cutTime(data.closeTime)
                modal.username.value = data.username
            }
        },

        closeModal() {
            const modal = this.modal
            const arrClear = ['name', 'address', 'telephone', 'openTime', 'closeTime', 'username']

            arrClear.forEach(clear => {
                modal[clear] = {
                    value: "",
                    isInvalid: false
                }
            })

            const docModal = document.querySelector('#sellerModal')
            const modalSeller = bootstrap.Modal.getInstance(docModal)
            modalSeller.hide()
        },

        manageButtonCU(){
            const type = this.modal.type
            return type? this.updateSeller() : this.createSeller()
        },

        cutAdress(address) {
            const maxString = 30
            if (address.length <= maxString) return address
            return address.substring(0, maxString) + "..."
        },

        cutTime(time) {
            return time.substring(0, 5)
        },

        userWithNoProfile(){
            const listSeller = this.sellers.map(sell => sell.username)
            const users = this.users
            return users.filter(user => {
                if (user.role === "SELLER") {
                    return !listSeller.includes(user.username)
                }
            })
        },

        async getAllSeller(){
            try {
                const objConfig = this.config
                const config = {
                    method: "GET",
                    url: objConfig.url + objConfig.endpointV1 + 'dashboard',
                    headers: objConfig.headers
                }
                const data = await axios(config)
                const dataGet = data.data.data

                this.sellers = dataGet.listStores
                this.users = dataGet.listUsers
            } catch (error) {
                const codeError = error.code || error.status
                if (codeError === "ERR_NETWORK") {
                    this.createNotif("error", "Service Error, get seller failed")
                }
            }
        },

        async createSeller(){
            try {
                const objConfig = this.config
                const modal = this.modal
                const isError = this.inputCheck()
                if (isError) throw new Error("value is invalid")

                const config = {
                    method: 'POST',
                    url: objConfig.url + objConfig.endpointV1 + 'stores',
                    headers: objConfig.headers,
                    data: {
                        store_name: modal.name.value,
                        address: modal.address.value,
                        telephone: modal.telephone.value,
                        open_time: modal.openTime.value + ':00',
                        close_time: modal.closeTime.value + ':00',
                        username: modal.username.value,
                    }
                }

                await axios(config)
                this.sellers.push({
                    name: modal.name.value,
                    address: modal.address.value,
                    phone: modal.telephone.value,
                    openTime: modal.openTime.value,
                    closeTime: modal.closeTime.value,
                    username: modal.username.value,
                })
                this.sendLengthSellers()
                this.createNotif("success", `Create seller successfully`)
                this.closeModal()
            } catch (error) {
                const codeError = error.code || error.status
                if (codeError === "ERR_BAD_REQUEST") {
                    if (error.response.data.code) {
                        this.createNotif("error", error.response.data.message)
                    } else {
                        this.createNotif("error", error.response.data.error)
                    }
                } else if (codeError === "ERR_BAD_RESPONSE"){
                    this.createNotif("error", error.response.statusText)
                } else if (codeError === "ERR_NETWORK") {
                    this.createNotif("error", "Service Error, create seller failed")
                }
            }
        },

        async updateSeller(){
            try {
                const objConfig = this.config
                const modal = this.modal
                const isError = this.inputCheck()
                if (isError) throw new Error("value is invalid")

                const config = {
                    method: 'PUT',
                    url: objConfig.url + objConfig.endpointV1 + 'stores',
                    headers: objConfig.headers,
                    data: {
                        store_name: modal.name.value,
                        address: modal.address.value,
                        telephone: modal.telephone.value,
                        open_time: modal.openTime.value + ':00',
                        close_time: modal.closeTime.value + ':00',
                        username: modal.username.value,
                    }
                }

                await axios(config)
                this.modifSellers(true, modal.username.value, {
                    name: modal.name.value,
                    address: modal.address.value,
                    phone: modal.telephone.value,
                    openTime: modal.openTime.value,
                    closeTime: modal.closeTime.value,
                    username: modal.username.value,
                })
                this.createNotif("success", `Update seller successfully`)
                this.closeModal()
            } catch (error) {
                const codeError = error.code || error.status
                console.log(error);
                if (codeError === "ERR_BAD_REQUEST") {
                    if (error.response.data.code) {
                        this.createNotif("error", error.response.data.message)
                    } else {
                        this.createNotif("error", error.response.data.error)
                    }
                } else if (codeError === "ERR_BAD_RESPONSE"){
                    this.createNotif("error", error.response.statusText)
                } else if (codeError === "ERR_NETWORK") {
                this.createNotif("error", "Service Error, update seller failed")
                }
            }
        },

        async deleteSeller() {
            try {
                const objConfig = this.config
                const modal = this.modal
                const username = modal.username.value
                const config = {
                    method: "DELETE",
                    url: objConfig.url + objConfig.endpointV1 + 'stores/' + username,
                    headers: objConfig.headers
                }
                
                await axios(config)
                this.modifSellers(false, username)
                this.sendLengthSellers()
                this.createNotif("success", `Delete seller ${username} successfully`)
                this.closeModal()
            } catch (error) {
                const codeError = error.code || error.status
                if (codeError === "ERR_BAD_REQUEST") {
                    if (error.response.data.code) {
                        this.createNotif("error", error.response.data.message)
                    } else {
                        this.createNotif("error", error.response.data.error)
                    }
                } else if (codeError === "ERR_BAD_RESPONSE"){
                    this.createNotif("error", error.response.statusText)
                } else if (codeError === "ERR_NETWORK") {
                    this.createNotif("error", "Service Error, delete seller failed")
                }
            }
        },

        inputCheck() {
            const modal = this.modal
            const name = modal.name
            const address = modal.address
            const telephone = modal.telephone
            const openTime = modal.openTime
            const closeTime = modal.closeTime
            const username = modal.username

            name.isInvalid = name.value ? false : true
            address.isInvalid = address.value ? false : true
            telephone.isInvalid = telephone.value ? false : true
            openTime.isInvalid = openTime.value ? false : true
            closeTime.isInvalid = closeTime.value ? false : true
            username.isInvalid = username.value ? false : true

            const isError = name.isInvalid || address.isInvalid || telephone.isInvalid || openTime.isInvalid || closeTime.isInvalid || username.isInvalid
            return isError 
        },

        modifSellers(isUpdate, username, data = null) {
            const index = this.sellers.findIndex(sell => sell.username == username)
            if (isUpdate) {
                this.sellers[index] = data
            } else {
                this.sellers.splice(index, 1)
            }
        },

        sendLengthSellers(){
            this.$emit("data-length-sellers", this.sellers.length)
        },

        changePage(isPage, data){
            if (isPage) {
                this.filter.page.now = data
            } else {
                this.filter.page.now = data ? this.filter.page.now + 1 : this.filter.page.now - 1
            }
        },

    },
    computed: {
        comSearch() {
            const filter = this.filter
            const search = filter.search
            const page = filter.page.now
            const sellers = this.sellers
            const totalDataShow = 4

            let listDataFilter = sellers.filter(seller => {
                return seller.name.match(search)
            })

            const jumlahPage = Math.ceil(sellers.length / totalDataShow) || 1
            const indexFirstDataShow = (page -1) * totalDataShow
            const indexLastDataShow = (page * totalDataShow) - 1
            filter.page.total = jumlahPage

            return listDataFilter.filter((data, index) => {
                if (index >= indexFirstDataShow && index <= indexLastDataShow) return data
            })
        },

        listPage() {
            const page = this.filter.page
            const pageNow = page.now
            const pageTotal = page.total
            let listPage = []

            if(pageNow === 1){
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