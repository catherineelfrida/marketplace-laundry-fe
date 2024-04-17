<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <div class="d-flex">
                    <h4 class="font-weight-bolder mb-0">Sign In</h4>
                    <p class="mb-0 mt-2 ms-2 text-danger text-sm">{{ auth.role[auth.loginTo] }}</p>
                  </div>
                  <p class="mb-0 text-sm">Enter your username and password to sign in </p>
                  <p class="mb-0 text-sm-start text-danger" style="font-size: 12px;" v-if="objError.in === 3" ><small>{{ objError.message }}</small></p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="login()">
                    <div class="mb-3">
                      <argon-input class="mb-0" type="text" placeholder="Username" name="username" size="lg" v-model:value="auth.username"/> 
                      <p class="mt-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 1" ><small>{{ objError.message }}</small></p>
                    </div>
                    <div class="mb-3">
                      <argon-input class="mb-0" type="password" placeholder="Password" name="password" size="lg" v-model:value="auth.password"/>
                      <p class="mt-0 text-sm-end text-danger" style="font-size: 12px;" v-if="objError.in === 2" ><small>{{ objError.message }}</small></p>
                    </div>
                    <p class="text-end text-sm">
                      Click for 
                      <a 
                        class="text-success font-weight-bold"
                        href="#"
                        @click="switchLogin"
                      >
                        Sign In as {{ auth.role[auth.switchLoginTo] }}
                      </a>
                    </p>
                    <div class="text-center">
                      <argon-button
                        class="mt-0"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        type="submit"
                      >Sign in</argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                      href="signup"
                      class="text-success text-gradient font-weight-bold"
                    >Sign up</a>
                  </p>
                </div>
              </div>
            </div>
            <div
            class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
          background-size: cover;"
              >
                <span class="mask bg-gradient-success opacity-6"></span>

                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >{{ auth.role[auth.loginTo] }}</h4>
                <p
                  class="text-white position-relative"
                >{{ subTitle[auth.loginTo] }}</p>

                <div 
                  class="position-absolute bottom-2 end-5 text-success"
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
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

export default {
  name: "signin",
  data() {
    return {
      config: {
        url: process.env.VUE_APP_URL_DEVELOPER,
        endpointV1: process.env.VUE_APP_ENDPOINT_V1,
        headers: {"Content-Type": "application/json"}
      },
      auth: {
        username: "",
        password: "",
        loginTo: 1,
        switchLoginTo: 2,
        role: {
          0: "Admin",
          1: "Customer",
          2: "Store"
        },
        backEndRoles: {
          ADMIN: 0,
          CUSTOMER: 1,
          SELLER: 2
        }
      }, 
      objError: {
        in: 0, // 1 username, 2 password, 3 role
        message: ""
      },
      subTitle: {
        0: "Manage all users.",
        1: "Cultivate lazy washing, because washing is our job.",
        2: "We hope this application can help your laundry business succeed."
      }
    };
  },
  components: {
    // Navbar,
    ArgonInput,
    // ArgonSwitch,
    ArgonButton,
    // ArgonAlert
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
    switchLogin() {
      const objAuth = this.auth
      const roleTo = objAuth.switchLoginTo
      const aRole = Object.keys(objAuth.role).map(Number);
      const maxIndex = aRole.length - 1
      const indexOfRole = aRole.indexOf(roleTo)
      
      if (roleTo > aRole.length) {
        console.log("error switchLoginTo !include the role");
      }

      const switchRoleTo = maxIndex !== indexOfRole ? roleTo + 1 : 0
      objAuth.loginTo = roleTo
      objAuth.switchLoginTo = switchRoleTo
    },

    async login() {
      try {
        const objAuth = this.auth
        const objConfig = this.config
        const username = objAuth.username
        const password = objAuth.password
        let error = {}

        if (!username) {
          error = new Error('Username cant be empty')
          error.status = 400
        } else if (!password) {
          error = new Error('Password cant be empty')
          error.status = 400
        }

        if (error.status) throw error

        const loginConfig = {
          method: 'POST',
          url: objConfig.url + objConfig.endpointV1 + "auth/login",
          headers: objConfig.headers,
          data: {
            username: objAuth.username,
            password: objAuth.password
          }
        }

        const data = await axios(loginConfig)
        const dataLogin = data.data.data
        const user = dataLogin.user
        const loginRole = objAuth.backEndRoles[user.role]

        if (objAuth.loginTo !== loginRole){
          error = new Error(`You must sign in as a ${objAuth.role[loginRole]}`)
          error.status = 400
        } 
        // else if (loginRole === 0){
        //   error = new Error(`Admin tools not available yet, coming soon`)
        //   error.status = 400
        // }

        if (error.status) throw error



        localStorage.setItem("token", dataLogin.accessToken)
        localStorage.setItem("role", loginRole)
        localStorage.setItem("userId", user.id)
        if (loginRole === 0) {
          this.$router.push({name: "Admin"})
        }
        if (loginRole === 1 ) {
          const id = dataLogin.profileId.split(" ").length !== 1 ? 0 : dataLogin.profileId
          localStorage.setItem("profileId", id)
          this.$router.push({name: "Store"})
        }
        if (loginRole === 2 ) {
          const id = dataLogin.storeId.split(" ").length !== 1 ? 0 : dataLogin.storeId
          localStorage.setItem("storeId", id)
          this.$router.push({name: "/"})
        }
        

      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        // if (codeError === 'ERR_NETWORK') buang ke halaman server error
        if (codeError === 'ERR_BAD_REQUEST') {
          const message = error.response.data.message
          const errorIn =  message.split(" ")[0]
          
          if (errorIn === 'User') this.objError.in = 1
          if (errorIn === 'Password') this.objError.in = 2

          this.objError.message = message
        } else if (codeError === 400) {
          const message = error.message
          const errorIn =  message.split(" ")[0]

          if (errorIn === 'You' || errorIn === 'Admin' ) this.objError.in = 3
          if (errorIn === "Username") this.objError.in = 1
          if (errorIn === "Password") this.objError.in = 2

          this.objError.message = message
        }
      }
    }

  }
};
</script>
