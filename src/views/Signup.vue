<template>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-2 pb-11 m-3 border-radius-lg"
      style="background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg'); background-position: top;"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">Welcome!</h1>
            <p
              class="text-lead text-white"
            >Use these awesome forms to login or create new account in your project for free.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n12 mt-md-n12 mt-n12 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4 pb-0">
              <h5>{{ role[registTo] }} register</h5>
            </div>
            <div class="card-body">
              <form role="form" @submit.prevent="regist()">
                <argon-input class="mb-0" type="text" placeholder="Username" aria-label="Username" v-model:value="user.username"/>
                <p class="mt-0 me-2 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 1" ><small>{{ objError.message }}</small></p>
                <argon-input class="mb-0 mt-3" type="password" placeholder="Password" aria-label="Password" v-model:value="user.password"/>
                <p class="mt-0 me-2 m-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 2" ><small>{{ objError.message }}</small></p>
                <p class="text-end text-sm mt-3 me-2">
                  Click for 
                  <a 
                    class="text-dark font-weight-bold"
                    href="#"
                    @click="switchRegist"
                  >
                    Register as {{ role[switchRegistTo] }}
                  </a>
                </p>
                <div class="text-center">
                  <argon-button 
                    fullWidth 
                    color="dark" 
                    variant="gradient" 
                    class="my-4 mb-2 mt-3"
                    type="submit"
                  >Sign up</argon-button>
                </div>
                <p class="text-sm mt-3 mb-0 ms-2">
                  Already have an account?
                  <a
                    href="/signin"
                    class="text-dark font-weight-bolder"
                  >Sign in</a>
                </p>
              </form>
            </div>
          </div>
          <div
            class="text-center copyright text-muted mt-3"
            style="font-size: 12px;"
          >
            ©
            {{ 2023 }}, made with
            <i class="fa fa-heart"></i> by
            <a>Laundry Team</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios"
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

export default {
  name: "signin",
  data(){
    return {
      config: {
        url: process.env.VUE_APP_URL_DEVELOPER,
        endpointV1: process.env.VUE_APP_ENDPOINT_V1,
        headers: {"Content-Type": "application/json"}
      },
      registTo: 0,
      switchRegistTo: 1,
      role: {
        0: "Customer",
        1: "Store"
      },
      user: {
        username: "",
        password: "",
        backEndRoles: {
          0: "CUSTOMER",
          1: "SELLER"
        }
      },
      objError: {
        in: 0,
        message: ""
      }
    }
  },
  components: {
    ArgonInput,
    ArgonButton,
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },

  methods: {
    switchRegist() {
      const roleTo = this.switchRegistTo
      const aRole = Object.keys(this.role).map(Number);
      const maxIndex = aRole.length - 1
      const indexOfRole = aRole.indexOf(roleTo)
      
      if (roleTo > aRole.length) {
        console.log("error switchRegistTo !include the role");
      }

      const switchRoleTo = maxIndex !== indexOfRole ? roleTo + 1 : 0
      this.registTo = roleTo
      this.switchRegistTo = switchRoleTo
    },

    async regist() {
      try {
        const user      = this.user
        const username  = user.username
        const password  = user.password
        const objConfig = this.config

        let error = {}
        if (!username) {
          error = new Error('Username cant be empty')
          error.status = 400
        } else if (!password) {
          error = new Error('Password cant be empty')
          error.status = 400
        }

        if (error.status) throw error

        const registConfig = {
          method: 'POST',
          url: objConfig.url + objConfig.endpointV1 + "users",
          headers: objConfig.headers,
          data: {
            username: username,
            password: password,
            role    : user.backEndRoles[this.registTo]
          }
        }

        await axios(registConfig)

        this.$notify({ 
          type: "success",
          duration: -1,
          text: "You have successfully registered as a " + this.role[this.registTo]
        });
      } catch (error) {
        const codeError = error.code || error.status

        if (codeError === 'ERR_BAD_REQUEST'){
          const message = error.response.data.message
          const errorIn = message.split(" ")[0]

          if (errorIn === 'Username') this.objError.in = 1
          
          this.objError.message = message
        } else if (codeError === 400){
          const message = error.message
          const errorIn = message.split(" ")[0]

          if (errorIn === "Username") this.objError.in = 1
          if (errorIn === "Password") this.objError.in = 2

          this.objError.message = message
        }
      }
    }
  }
};
</script>
