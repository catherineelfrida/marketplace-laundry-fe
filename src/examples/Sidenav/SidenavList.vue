<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav" >
      <li class="nav-item" v-if="role == 2">
        <sidenav-item
          url="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'لوحة القيادة' : 'Dashboard'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item" v-if="role === 1">
        <sidenav-item
          url="/store"
          :class="getRoute() === 'store' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'الجداول' : 'Store'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item" v-if="role !== 0">
        <sidenav-item
          url="/transaction"
          :class="getRoute() === 'transaction' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'الجداول' : 'Transaction'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-chart-bar-32 text-danger text-sm opacity-10"
            ></i>
          </template>

        </sidenav-item>
      </li>
      <li class="nav-item" v-if="role === 0">
        <sidenav-item
          url="/admin"
          :class="getRoute() === 'admin' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'الجداول' : 'Admin Dashboard'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-chart-bar-32 text-danger text-sm opacity-10"
            ></i>
          </template>

        </sidenav-item>
      </li>
      <!-- <li class="nav-item">
        <sidenav-item
          url="/billing"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'الفواتیر' : 'Billing'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          url="/virtual-reality"
          :class="getRoute() === 'virtual-reality' ? 'active' : ''"
          :navText="
            this.$store.state.isRTL ? 'الواقع الافتراضي' : 'Virtual Reality'
          "
        >
          <template v-slot:icon>
            <i class="ni ni-app text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          url="/rtl-page"
          :class="getRoute() === 'rtl-page' ? 'active' : ''"
          navText="RTL"
        >
          <template v-slot:icon>
            <i class="ni ni-world-2 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->
      <!-- <li class="mt-3 nav-item">
        <h6
          v-if="this.$store.state.isRTL"
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="this.$store.state.isRTL ? 'me-4' : 'ms-2'"
        >
          صفحات المرافق
        </h6>
        <h6
          v-else
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="this.$store.state.isRTL ? 'me-4' : 'ms-2'"
        >
          ACCOUNT
        </h6>
      </li> -->
      <li class="nav-item" v-if="role === 0">
        <sidenav-item
          url="/signin"
          :class="getRoute() === 'logout' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'حساب تعريفي' : 'Logout'"
          @click="logoutAdmin()"
        >
          <template v-slot:icon>
            <i class="ni ni-user-run text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item" v-if="role !== 0">
        <sidenav-item
          url="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'حساب تعريفي' : 'Profile'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <!-- <li class="nav-item">
        <sidenav-item
          url="/signin"
          :class="getRoute() === 'signin' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'تسجيل الدخول' : 'Sign In'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          url="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'اشتراك' : 'Sign Up'"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->
    </ul>
  </div>
</template>
<script>
import SidenavItem from "./SidenavItem.vue";
// import SidenavCard from "./SidenavCard.vue";

export default {
  name: "SidenavList",
  props: {
    cardBg: String
  },
  data() {
    return {
      title: "Argon Dashboard 2",
      controls: "dashboardsExamples",
      isActive: "active",
      role: parseInt(localStorage.getItem("role"))
    };
  },
  components: {
    SidenavItem,
    // SidenavCard
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      // console.log(routeArr);
      return routeArr[1];
    },

    logoutAdmin() {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
      this.$router.push({name: "Signin"})
    }
  }
};
</script>
