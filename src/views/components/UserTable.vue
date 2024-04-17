<template>
  <!-- Modal -->
  <div class="modal fade" id="userModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
              v-model="modal.username.value"
              :class="{'is-invalid': modal.username.isInvalid}"
              id="floatingInput" 
              placeholder="Username"
            >
            <label for="floatingInput">Username</label>
          </div>
          <div class="form-floating">
            <input 
              type="password" 
              class="form-control" 
              v-model="modal.password.value"
              :class="{'is-invalid': modal.password.isInvalid}"
              id="floatingPassword" 
              placeholder="Password"
            >
            <label for="floatingPassword">Password</label>
          </div>
          <div id="app" class="input-group mt-3">
              <select class="form-select text-bold p-3 text-xs" id="inputGroupSelect01" v-model="modal.role.value" :class="{ 'border-danger':modal.role.isInvalid }">
                <option disabled :selected="modal.role.value === ''" :value="''" >Select Items</option>
                <option v-for="(role, index) in roles" :key="index" :value="role">{{ role }}</option>
              </select>
            </div>
        </div>
        <div 
          class="modal-footer"
          :class="{'d-flex justify-content-between' : modal.type}"
        >
          <button v-if="modal.type === 1" type="button" class="btn btn-danger" @click="deleteUser()">Delete</button>
          <button type="button" class="btn btn-success" @click="manageButtonCU()">{{ modal.type ? "Update" : "Create" }}</button>
        </div>
      </div>
    </div>
  </div>


  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between px-2">
        <h6>User table</h6>
        <font-awesome-icon icon="fa-solid fa-plus" role="button" class="mt-1"  data-bs-toggle="modal" data-bs-target="#userModal" @click="openModal(0)"/>
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
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">User</th>
              <th class="text-end text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data, index) in comSearch"
              :key="data.id"
              :class="{'bg-gray-100' : index % 2 === 0}"
            >
              <td class="px-4">
                <p class="text-sm font-weight-bold mb-0 ">{{ data.username }}</p>
                <p class="text-xxs text-secondary mb-0">{{ data.role }}</p>
              </td>
              <td class="align-middle text-end px-4">
                <a
                  href="javascript:;"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="Edit user"
                  data-bs-toggle="modal" 
                  data-bs-target="#userModal"
                  @click="openModal(1, index, data)"
                >Edit</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card-footer  d-flex justify-content-center">
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
import axios from 'axios';
import ArgonInput from '../../components/ArgonInput.vue';
import ArgonPagination from '../../components/ArgonPagination.vue';
import ArgonPaginationItem from '../../components/ArgonPaginationItem.vue';
import bootstrap from "bootstrap/dist/js/bootstrap"

export default {
  name: "user-table",
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
      roles: ['CUSTOMER', 'SELLER', 'ADMIN'],
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
        id: "",
        username: {
          value: "",
          isInvalid: false
        },
        password: {
          value: "",
          isInvalid: false
        },
        role: {
          value: "",
          isInvalid: false
        }
      },
      users: []
    }
  },
  components: {
    ArgonInput,
    ArgonPagination,
    ArgonPaginationItem
  },
  created(){
    const token = this.auth.token
    if (!token) this.$router.push({name: "Signin"})
    this.config.headers.authorization = token
  },
  async mounted(){
    await this.getAllUsers()
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
        modal.username.value = data.username
        modal.role.value = data.role
      }
    },

    closeModal() {
      const modal = this.modal
      const arrClear = ['username', 'password', 'role']

      arrClear.forEach(clear => {
        modal[clear] = {
          value: "",
          isInvalid: false
        }
      })

      const docModal = document.querySelector('#userModal')
      const modalUser = bootstrap.Modal.getInstance(docModal)
      modalUser.hide()
    },

    manageButtonCU(){
      const type = this.modal.type
      return type? this.updateUser() : this.createUser()
    },

    async getAllUsers() {
      try {
        const objConfig = this.config
        const config = {
          method: "GET",
          url: objConfig.url + objConfig.endpointV1 + 'users',
          headers: objConfig.headers
        }
        const data = await axios(config)
        const dataGet = data.data.data
        this.users = dataGet
      } catch (error) {
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, get users failed")
        }
      }
    },

    async createUser() {
      try {
        const objConfig = this.config
        const modal = this.modal
        const isError = this.inputCheck()
        if (isError) throw new Error("value is invalid")

        const config = {
          method: 'POST',
          url: objConfig.url + objConfig.endpointV1 + 'users',
          headers: objConfig.headers,
          data: {
            username: modal.username.value,
            password: modal.password.value,
            role: modal.role.value
          }
        }

        const data = await axios(config)
        console.log("test : ", data.data.data);
        this.users.push(data.data.data)
        this.sendLengthUsers()
        this.createNotif("success", `Create user successfully`)
        this.closeModal()
      } catch (error) {
        const codeError = error.code || error.status
        console.log(error);
        if (codeError === "ERR_BAD_REQUEST") {
          this.createNotif("error", error.response.data.message)
        } else if (codeError === "ERR_BAD_RESPONSE"){
          this.createNotif("error", error.response.statusText)
        } else if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, create user failed")
        }
      }
    },

    async updateUser() {
      try {
        const objConfig = this.config
        const modal = this.modal
        const isError = this.inputCheck()
        if (isError) throw new Error("value is invalid")

        const config = {
          method: 'PUT',
          url: objConfig.url + objConfig.endpointV1 + 'users/' + modal.id,
          headers: objConfig.headers,
          data: {
            username: modal.username.value,
            password: modal.password.value,
            role: modal.role.value
          }
        }

        const data = await axios(config)
        this.modifUsers(true, modal.id, data.data.data)
        this.sendLengthUsers()
        this.createNotif("success", `Update user successfully`)
        this.closeModal()
      } catch (error) {
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, update user failed")
        }
      }
    },

    async deleteUser() {
      try {
        const objConfig = this.config
        const modal = this.modal
        const config = {
          method: "DELETE",
          url: objConfig.url + objConfig.endpointV1 + 'users/' + modal.id,
          headers: objConfig.headers
        }
        
        await axios(config)
        this.modifUsers(false, modal.id)
        this.sendLengthUsers()
        this.createNotif("success", `Delete user ${modal.username.value} successfully`)
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
          this.createNotif("error", "Service Error, delete user failed")
        }
      }
    },

    inputCheck() {
      const modal = this.modal
      const username = modal.username
      const password = modal.password
      const role = modal.role

      console.log(username.value, password.value, role.value);

      username.isInvalid = username.value ? false : true
      password.isInvalid = password.value ? false : true
      role.isInvalid = role.value ? false : true

      const isError = username.isInvalid || password.isInvalid || role.isInvalid
      return isError 
    },

    modifUsers(isUpdate, userId, data = null) {
        const index = this.users.findIndex(user => user.id == userId)
        if (isUpdate) {
            this.users[index] = data
        } else {
            this.users.splice(index, 1)
        }
    },

    sendLengthUsers(){
        this.$emit("data-length-users", this.users.length)
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
    comSearch(){
      const filter = this.filter
      const search = filter.search
      const page = filter.page.now
      const users = this.users
      const totalDataShow = 7

      let listDataFilter = users.filter(user => {
        return user.username.match(search)
      })

      const jumlahPage = Math.ceil(users.length / totalDataShow) || 1
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
};
</script>
