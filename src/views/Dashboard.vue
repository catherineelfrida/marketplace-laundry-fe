<template>
  <!-- Modal -->
  <div class="modal fade" id="modalService" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between">
          <h5 class="modal-title" id="staticBackdropLabel">{{ modal.title }}</h5>
          <font-awesome-icon icon="fa-solid fa-xmark" role="button" @click="closeModal()"/>
        </div>
        <div v-if="modal.modalType !== 0"> 
          <div class="modal-body row" v-if="modal.serviceType === 0">
            <div id="app" class="input-group mb-3">
              <select class="form-select text-bold" id="inputGroupSelect01" v-model="modal.detail[0].item.value" :class="{ 'border-danger':modal.detail[0].item.isInvalid }">
                <option disabled :selected="modal.detail[0].item.value === ''" :value="''" >Select Items</option>
                <option v-for="item in services.sub.items" :key="item.id" :value="item.id">{{ item.item_name }}</option>
              </select>
            </div>
            <div id="app" class="input-group mb-3">
              <select class="form-select text-bold" id="inputGroupSelect01" v-model="modal.detail[0].type.value" :class="{ 'border-danger':modal.detail[0].type.isInvalid }">
                <option disabled :selected="modal.detail[0].type.value === ''" :value="''">Select Types</option>
                <option v-for="dataType in services.sub.types" :key="dataType.id" :value="dataType.id">{{ dataType.service_name }}</option>
              </select>
            </div>
            <div id="app" class="input-group mb-3">
              <select class="form-select text-bold" id="inputGroupSelect01" v-model="modal.detail[0].duration.value" :class="{ 'border-danger':modal.detail[0].duration.isInvalid }">
                <option disabled :selected="modal.detail[0].duration.value === ''" :value="''">Select Durations</option>
                <option v-for="duration in services.sub.durations" :key="duration.id" :value="duration.id">{{ duration.duration_name }}</option>
              </select>
            </div>
            <div class="form-floating mb-3">
              <input 
                type="number" 
                class="form-control text-bold" 
                v-model="modal.detail[0].rate.value"
                :class="{ 'is-invalid': modal.detail[0].rate.isInvalid }"
                id="floatingInput" 
                placeholder="Price"
              >
              <label for="floatingInput" class="ms-3" >Price</label>
            </div>
          </div>
          <div class="modal-body row" v-if="modal.serviceType === 1">
            <div class="form-floating mb-3">
              <input 
                type="text" 
                class="form-control" 
                v-model="modal.detail[1].item_name.value"
                :class="{ 'is-invalid': modal.detail[1].item_name.isInvalid }"
                id="floatingInput" 
                placeholder="Name"
              >
              <label for="floatingInput" class="ms-3" >Name</label>
            </div>
          </div>
          <div class="modal-body row" v-if="modal.serviceType === 2">
            <div class="form-floating mb-3">
              <input 
                type="text" 
                class="form-control" 
                v-model="modal.detail[2].service_name.value"
                :class="{ 'is-invalid': modal.detail[2].service_name.isInvalid }"
                id="floatingInput" 
                placeholder="Name"
              >
              <label for="floatingInput" class="ms-3" >Name</label>
            </div>
            <div class="form-floating mb-3">
              <input 
                type="text" 
                class="form-control no-arrows" 
                v-model="modal.detail[2].description.value"
                :class="{ 'is-invalid': modal.detail[2].description.isInvalid }"
                id="floatingInput" 
                placeholder="Name"
              >
              <label for="floatingInput" class="ms-3" >Description</label>
            </div>
          </div>
          <div class="modal-body row" v-if="modal.serviceType === 3">
            <div class="form-floating mb-3">
              <input 
                type="text" 
                class="form-control" 
                v-model="modal.detail[3].duration_name.value"
                :class="{ 'is-invalid': modal.detail[3].duration_name.isInvalid }"
                id="floatingInput" 
                placeholder="Name"
              >
              <label for="floatingInput" class="ms-3" >Name</label>
            </div>
            <div class="form-floating mb-3">
              <input 
                type="number" 
                class="form-control" 
                v-model="modal.detail[3].hour.value"
                :class="{ 'is-invalid': modal.detail[3].hour.isInvalid }"
                id="floatingInput" 
                placeholder="Name"
              >
              <label for="floatingInput" class="ms-3" >Hour</label>
            </div>
            <div class="form-floating mb-3">
              <input 
                type="text" 
                class="form-control" 
                v-model="modal.detail[3].description.value"
                :class="{ 'is-invalid': modal.detail[3].description.isInvalid }"
                id="floatingInput" 
                placeholder="Name"
              >
              <label for="floatingInput" class="ms-3" >Description</label>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="modal-body row" v-if="modal.serviceType === 0">
            <p>
              You will delete the main service with 
              item <span class="text-danger">{{ modal.detail[0].item.name }}</span>
              , type <span class="text-danger">{{ modal.detail[0].type.name }}</span>
              , duration <span class="text-danger">{{ modal.detail[0].duration.name }}</span>
              and price <span class="text-danger">{{ modal.detail[0].rate.value }}</span>
            </p>
          </div>
          <div class="modal-body row" v-if="modal.serviceType === 1">
            <p>
              You will delete sub service item 
              <span class="text-danger">
                {{ modal.detail[1].item_name.value }}
              </span>
            </p>
          </div>
          <div class="modal-body row" v-if="modal.serviceType === 2">
            <p>
              You will delete sub service type 
              <span class="text-danger">
                {{ modal.detail[2].service_name.value }}
              </span>
            </p>
          </div>
          <div class="modal-body row" v-if="modal.serviceType === 3">
            <p>
              You will delete sub service duration 
              <span class="text-danger">
                {{ modal.detail[3].duration_name.value }}
              </span>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="manageServices()"> {{ modal.buttonType[modal.modalType] }} </button>
        </div>
      </div>
    </div>
  </div>

  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-header p-4 pt-3 pb-1 d-flex justify-content-between">
                <div>
                  <h6 class="mb-0">Service Items</h6>
                  <p class="lh-1 mt-0 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="error.service.sub.items.subTitle" ><small>Please create an item</small></p>
                </div>
                <font-awesome-icon icon="fa-solid fa-plus" role="button" class="mt-1" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(1, 1)" />
              </div>
              <div class="card-body p-2">
                <ul class="list-group"  style="overflow-y: auto; max-height: 200px;">
                  <li 
                    class="list-group-item border-0 d-flex mb-2 p-3 bg-gray-200 bg-secondary border-radius-lg"
                    v-for="(item, index) in services.sub.items" :key="item.id"
                  >
                    <h6 class="my-auto text-sm ">{{ item.item_name }}</h6>
                    <div class=" ms-auto text-end ">
                      <a class="text-dark px-4 text-xxl" href="javascript:;" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(2, 1, index)">
                        <i class="fas fa-pencil-alt text-dark" aria-hidden="true"></i>
                      </a>
                      <a class="text-danger text-xxl" href="javascript:;" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(0, 1, index)">
                        <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-header p-4 pt-3 pb-1 d-flex justify-content-between">
                <div>
                  <h6 class="mb-0">Service Types</h6>
                  <p class="lh-1 mt-0 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="error.service.sub.types.subTitle" ><small>Please create an type</small></p>
                </div>
                <font-awesome-icon icon="fa-solid fa-plus" role="button" class="mt-1" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(1, 2)" />
              </div>
              <div class="card-body p-2">
                <ul class="list-group"  style="overflow-y: auto; max-height: 200px;">
                  <li 
                    class="list-group-item border-0 d-flex mb-2 p-3 bg-gray-200 bg-secondary border-radius-lg"
                    v-for="(datatype, index) in services.sub.types" :key="datatype.id"
                  >
                    <div style="width: 140px;">
                      <h6 class="my-auto text-sm ">{{ datatype.service_name }}</h6>
                      <p class="text-xxs mb-0">{{ datatype.description }}</p>
                    </div>
                    <div class=" ms-auto text-end ">
                      <a class="text-dark px-4 text-xxl" href="javascript:;" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(2, 2, index)" >
                        <i class="fas fa-pencil-alt text-dark" aria-hidden="true"></i>
                      </a>
                      <a class="text-danger text-xxl" href="javascript:;" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(0, 2, index)" >
                        <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-12 mb-4">
            <div class="card">
              <div class="card-header p-4 pt-3 pb-1 d-flex justify-content-between">
                <div>
                  <h6 class="mb-0">Service Durations</h6>
                  <p class="lh-1 mt-0 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="error.service.sub.durations.subTitle" ><small>Please create an duration</small></p>
                </div>
                <font-awesome-icon icon="fa-solid fa-plus" role="button" class="mt-1" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(1, 3)" />
              </div>
              <div class="card-body p-2">
                <ul class="list-group"  style="overflow-y: auto; max-height: 200px;">
                  <li 
                    class="list-group-item border-0 d-flex mb-2 p-3 bg-gray-200 bg-secondary border-radius-lg"
                    v-for="(duration, index) in services.sub.durations" :key="duration.id"
                  >
                    <div style="width: 140px;" >
                      <h6 class="my-auto text-sm ">{{ duration.duration_name }}</h6>
                      <p class="text-xxs mb-0">{{ duration.description }}</p>
                    </div>
                    <div class=" ms-auto text-end ">
                      <a class="text-dark px-4 text-xxl" href="javascript:;" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(2, 3, index)" >
                        <i class="fas fa-pencil-alt text-dark" aria-hidden="true"></i>
                      </a>
                      <a class="text-danger text-xxl" href="javascript:;" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(0, 3, index)">
                        <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-header p-4 pt-3 pb-2 d-flex justify-content-between">
                <div>
                  <h6 class="mb-0">Main Services</h6>
                  <p class="lh-1 mt-0 mb-0 text-sm-end text-danger" style="font-size: 12px;" v-if="error.service.main.subTitle.status" ><small>{{ error.service.main.subTitle.message }}</small></p>
                </div>
                <font-awesome-icon icon="fa-solid fa-plus" role="button" class="mt-1" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(1, 0)" />
              </div>
              <div class="card-body p-2">
                <ul class="list-group"  style="overflow-y: auto; max-height: 380px;">
                  <li 
                    class="list-group-item border-0 d-flex mb-2 p-3 bg-gray-200 bg-secondary border-radius-lg"
                    v-for="(service, index) in services.main" :key="service.id"
                  >
                    <div style="width: 180px;" >
                      <h6 class="my-auto text-md mb-1 ">{{ service.serviceItem.item_name }}</h6>
                      <p class="text-xs mb-0 mb-1">
                        Type :
                        <span class="text-dark font-weight-bold">{{ service.serviceType.service_name }}</span>
                      </p>
                      <p class="text-xs mb-0 mb-1">
                        Duration :
                        <span class="text-dark font-weight-bold">{{ service.serviceDuration.duration_name }}</span>
                      </p>
                      <p class="text-xs mb-0 mb-1">
                        Price :
                        <span class="text-danger font-weight-bold">{{ service.rate }}</span>
                      </p>
                      
                    </div>
                    <div class=" ms-auto text-end ">
                      <a class="text-dark px-4 text-xxl" href="javascript:;" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(2, 0, index)">
                        <i class="fas fa-pencil-alt text-dark" aria-hidden="true"></i>
                      </a>
                      <a class="text-danger text-xxl" href="javascript:;" data-bs-toggle="modal" data-bs-target="#modalService" @click="openModal(0, 0, index)">
                        <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import bootstrap from "bootstrap/dist/js/bootstrap"
// import bootstrap from "bootstrap/dist/js/bootstrap";

// import ArgonInput from "@/components/ArgonInput.vue"
// import Card from "@/examples/Cards/Card.vue";
// import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
// import Carousel from "./components/Carousel.vue";
// import CategoriesCard from "./components/CategoriesCard.vue";

// import US from "@/assets/img/icons/flags/US.png";
// import DE from "@/assets/img/icons/flags/DE.png";
// import GB from "@/assets/img/icons/flags/GB.png";
// import BR from "@/assets/img/icons/flags/BR.png";

export default {
  name: "dashboard-default",
  data() {
    return {
      modal: {
        title: "",
        modalType: null,
        serviceType: null,
        buttonType: {
          0: "Delete",
          1: "Save",
          2: "Edit"
        },
        status: {
          0: "Delete",
          1: "Create",
          2: "Update"
        },
        detail: {
          0: {
            name: "main service",
            index: null,
            id: "",
            item: {
              value: "",
              isInvalid: false 
            },
            type: {
              value: "",
              isInvalid: false 
            },
            duration: {
              value: "",
              isInvalid: false 
            },
            rate: {
              value: null,
              isInvalid: false
            }
          },
          1: {
            name: "item",
            index: null,
            id: "",
            item_name: {
              value: "",
              isInvalid: false
            }
          },
          2: {
            name: "type",
            index: null,
            id: "",
            service_name: {
              value: "",
              isInvalid: false
            },
            description: {
              value: "",
              isInvalid: false
            }
          },
          3: {
            name: "duration",
            index: null,
            id: "",
            duration_name: {
              value: "",
              isInvalid: false
            },
            hour: {
              value: null,
              isInvalid: false
            },
            description: {
              value: "",
              isInvalid: false
            }
          }
        }
      },
      config: {
        url: process.env.VUE_APP_URL_DEVELOPER,
        endpointV1: process.env.VUE_APP_ENDPOINT_V1,
        headers: {"Content-Type": "application/json"}
      },
      auth: {
        token: localStorage.getItem("token"),
        profileId: localStorage.getItem("profileId"),
        storeId: localStorage.getItem("storeId"),
        role: parseInt(localStorage.getItem("role"))
      },
      services: {
        sub: {
          items: [],
          types: [],
          durations: [],
        },
        main: []
      },
      error: {
        service: {
          sub: {
            items: {
              subTitle: true
            },
            types: {
              subTitle: true
            }, 
            durations: {
              subTitle: true
            }
          },
          main: {
            subTitle: {
              status: false,
              message: ""
            }
          }
        }
      }
    };
  },
  components: {
    // ArgonInput
  },

  created() {
    const auth = this.auth
    const token = auth.token
    const role = auth.role
    const id = role === 1 ? auth.profileId : auth.storeId

    if (!token) this.$router.push({name: "Signin"})
    if (id === '0') this.$router.push({name: "Profile"})
    if (role === 0) this.$router.push({name: "Admin"})
    if (role === 1) this.$router.push({name: "Store"})

    this.config.headers.authorization = token
  },

  async mounted(){
    // const errSubService = this.error.service.sub
    await this.getAllSubService()

    // const errSubServiceItems = errSubService.items.subTitle
    // const errSubServiceTypes = errSubService.types.subTitle
    // const errSubServiceDurations = errSubService.durations.subTitle

    // console.log("this.services.sub.items : ", errSubServiceItems);
    // console.log("this.services.sub.types : ", errSubServiceTypes);
    // console.log("this.services.sub.durations : ", errSubServiceDurations);

    await this.getMainService()

    // if (!errSubServiceItems && !errSubServiceTypes && !errSubServiceDurations) {
    //   console.log("getAllMainServices");
    // }
    
  },

  methods: {
    createNotif(type, text, duration = 3000){
      this.$notify({
        type: type,
        duration: duration,
        text: text,
      })
    },

    helperGetAllSubService() {
      const dataMain = this.modal.detail[0]
      const subService = this.services.sub
      const dataItem = subService.items.find(item => item.id === dataMain.item.value)
      const dataType = subService.types.find(type => type.id === dataMain.type.value)
      const dataDuration = subService.durations.find(duration => duration.id === dataMain.duration.value)
      return { item: dataItem, type: dataType, duration: dataDuration }
    },

    openModal(modalType, serviceType, serviceIndex = null) {
      const modal = this.modal
      const detailService = modal.detail[serviceType]

      modal.modalType = modalType
      modal.serviceType = serviceType
      detailService.index = serviceIndex
      modal.title = modal.status[modalType] + " " + modal.detail[serviceType].name

      if (modalType !== 1){
        if (serviceType === 0){
          const dataService = this.services.main[serviceIndex]
          detailService.id = dataService.id
          detailService.rate.value = dataService.rate
          detailService.item.value = dataService.serviceItem.id
          detailService.type.value = dataService.serviceType.id
          detailService.duration.value = dataService.serviceDuration.id
          if (modalType === 0){
            const dataValue = this.helperGetAllSubService()
            detailService.item.name = dataValue.item.item_name
            detailService.type.name = dataValue.type.service_name
            detailService.duration.name = dataValue.duration.duration_name
          }
        } else if (serviceType === 1){
          const dataService = this.services.sub.items[serviceIndex]
          detailService.id = dataService.id
          detailService.item_name.value = dataService.item_name
        } else if (serviceType === 2){
          const dataService = this.services.sub.types[serviceIndex]
          detailService.id = dataService.id
          detailService.service_name.value = dataService.service_name
          detailService.description.value = dataService.description
        } else if (serviceType === 3){
          const dataService = this.services.sub.durations[serviceIndex]
          detailService.id = dataService.id
          detailService.duration_name.value = dataService.duration_name
          detailService.hour.value = dataService.hour
          detailService.description.value = dataService.description
        }
      }
    },

    closeModal() {
      const modal = this.modal
      const serviceType = modal.serviceType
      const service = modal.detail[serviceType]
      const indexService = {
        0: ["item", "type", "duration", 'rate'],
        1: ["item_name"],
        2: ["service_name", "description"],
        3: ["duration_name", "hour", "description"],
      }

      indexService[serviceType].forEach(srvc => {
        service.id = ""
        service[srvc] = {
          value: "",
          isInvalid: false
        }
      })

      modal.modalType = null
      modal.serviceType = null
      modal.title = ""

      const docModal = document.querySelector('#modalService');
      const modalService = bootstrap.Modal.getInstance(docModal)
      modalService.hide()
    },

    async manageServices() {
      try {
        const modal = this.modal
        const errService = this.error.service
        const modalType = modal.modalType
        const serviceType = modal.serviceType
        const service = modal.detail[serviceType]
        const subService = this.services.sub

        if (modalType === 1){ // create
          if (serviceType === 0) { // main service
            const dataItem = service.item
            const dataType = service.type
            const dataDuration = service.duration
            const dataRate = service.rate
            dataItem.isInvalid = dataItem.value ? false : true
            dataType.isInvalid = dataType.value ? false : true
            dataDuration.isInvalid = dataDuration.value ? false : true
            dataRate.isInvalid = dataRate.value ? false : true
            const isError = dataItem.isInvalid || dataType.isInvalid || dataDuration.isInvalid || dataRate.isInvalid
            if(isError){
              throw new Error("value is invalid")
            } else {
              await this.createMainService()
              errService.main.subTitle.status = false
            }
          } else if (serviceType === 1) { // item
            const name = service.item_name
            name.isInvalid = name.value ? false : true
            const isError = name.isInvalid
            if (isError) {
              throw new Error("value is invalid")
            } else {
              await this.createSubServiceItem()
              errService.sub.items.subTitle = false
            }
          } else if (serviceType === 2) { // type
            const name = service.service_name
            const desc = service.description
            name.isInvalid = name.value ? false : true
            desc.isInvalid = desc.value ? false : true
            const isError = name.isInvalid || desc.isInvalid
            if (isError) {
              throw new Error("value is invalid")
            } else {
              await this.createSubServiceType()
              errService.sub.types.subTitle = false
            }
          } else if (serviceType === 3) { // duration
            const name = service.duration_name
            const hour = service.hour
            const desc = service.description
            name.isInvalid = name.value ? false : true
            hour.isInvalid = hour.value ? false : true
            desc.isInvalid = desc.value ? false : true
            const isError = name.isInvalid || hour.isInvalid || desc.isInvalid
            if (isError) {
              throw new Error("value is invalid")
            } else {
              await this.createSubServiceDuration()
              errService.sub.durations.subTitle = false
            }
          }
        } else if (modalType === 2){ // update
          if (serviceType === 0) { // main service
            const dataItem = service.item
            const dataType = service.type
            const dataDuration = service.duration
            const dataRate = service.rate
            if (!service.id) throw new Error("Somting went wrong");
            dataItem.isInvalid = dataItem.value ? false : true
            dataType.isInvalid = dataType.value ? false : true
            dataDuration.isInvalid = dataDuration.value ? false : true
            dataRate.isInvalid = dataRate.value ? false : true
            const isError = dataItem.isInvalid || dataType.isInvalid || dataDuration.isInvalid || dataRate.isInvalid
            if (isError) {
              throw new Error("value is invalid")
            } else {
              await this.updateMainService()
            }

          } else if (serviceType === 1) { // item
            const name = service.item_name
            if (!service.id) throw new Error("Somting went wrong");
            name.isInvalid = name.value ? false : true
            const isError = name.isInvalid
            if (isError) {
              throw new Error("value is invalid")
            } else {
              await this.updateSubServiceItem()
            }
          } else if (serviceType === 2) { // type
            const name = service.service_name
            const desc = service.description
            if (!service.id) throw new Error("Somting went wrong");
            name.isInvalid = name.value ? false : true
            desc.isInvalid = desc.value ? false : true
            const isError = name.isInvalid || desc.isInvalid
            if (isError) {
              throw new Error("value is invalid")
            } else {
              await this.updateSubServiceType()
            }
          } else if (serviceType === 3) { // duration
            const name = service.duration_name
            const hour = service.hour
            const desc = service.description
            if (!service.id) throw new Error("Somting went wrong");
            name.isInvalid = name.value ? false : true
            hour.isInvalid = hour.value ? false : true
            desc.isInvalid = desc.value ? false : true
            const isError = name.isInvalid || hour.isInvalid || desc.isInvalid
            if (isError) {
              throw new Error("value is invalid")
            } else {
              await this.updateSubServiceDuration()
            }
          }
        } else { // delete
          if (serviceType === 0) {
            if (!service.id) throw new Error("Somting went wrong")
            const listMainServices = this.services.main
            await this.deleteMainService()
            listMainServices.splice(service.index, 1)
            errService.main.subTitle.status = listMainServices.length ? false : true
          } else if (serviceType === 1) { // item
            if (!service.id) throw new Error("Somting went wrong")
            const listItems = subService.items
            await this.deleteSubServiceItem()
            listItems.splice(service.index, 1)
            errService.sub.items.subTitle = listItems.length ? false : true
          } else if (serviceType === 2) { // type
            if (!service.id) throw new Error("Somting went wrong")
            const listTypes = subService.types
            await this.deleteSubServiceType()
            listTypes.splice(service.index, 1)
            errService.sub.types.subTitle = listTypes.length ? false : true
          } else if (serviceType === 3) { // duration
            if (!service.id) throw new Error("Somting went wrong")
            const listDuration = subService.durations
            await this.deleteSubServiceDuration()
            listDuration.splice(service.index, 1)
            errService.sub.durations.subTitle = listDuration.length ? false : true
          }
        }

        const lSubItems = subService.items.length
        const lSubTypes = subService.types.length
        const lSubDurations = subService.durations.length

        if (lSubItems && lSubTypes && lSubDurations){
          this.error.service.main.subTitle.message = "Please create an main service"
        }

        this.closeModal()

      } catch (error) {
        console.log(error.message);
      }
    },

    // GET DATA
    async getAllSubService() {
      try {
        const objConfig     = this.config
        const subService    = this.services.sub
        const errSubService = this.error.service.sub
        const headers       = objConfig.headers
        const url           = objConfig.url + objConfig.endpointV1
        const urlItems      = url + "serviceitems"
        const urlTypes      = url + "servicetypes"
        const urlDurations  = url + "servicedurations"

        let [
          dataListItems,
          dataListTypes,
          dataListDurations,
        ] = await Promise.all([
          axios.get(urlItems, { headers: headers }),
          axios.get(urlTypes, { headers: headers }),
          axios.get(urlDurations, { headers: headers })
        ])

        dataListItems     = dataListItems.data.data
        dataListTypes     = dataListTypes.data.data
        dataListDurations = dataListDurations.data.data

        const errSubItems     = dataListItems.length ? false : true
        const errSubTypes     = dataListTypes.length ? false : true
        const errSubDurations = dataListDurations.length ? false : true

        errSubService.items.subTitle     = errSubItems
        errSubService.types.subTitle     = errSubTypes
        errSubService.durations.subTitle = errSubDurations

        if (errSubItems || errSubTypes || errSubDurations) {
          const errServiceMain = this.error.service.main.subTitle
          errServiceMain.status = true
          errServiceMain.message = "Please complete the sub service"
        } 

        subService.items     = dataListItems
        subService.types     = dataListTypes
        subService.durations = dataListDurations

      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error")
        }
      }
    },

    async getMainService() {
      try {
        const objConfig = this.config
        const getMainServiceConfig = {
          method: 'GET',
          url: objConfig.url + objConfig.endpointV1 + "services",
          headers: objConfig.headers,
        }

        const data = await axios(getMainServiceConfig)
        this.services.main = data.data.data
      } catch (error) {
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error")
        } else if (codeError === "ERR_BAD_REQUEST") {
          const err = error.response.data
          if (err.code === 404) {
            const errService = this.error.service
            const errItems = errService.sub.items.subTitle
            const errTypes = errService.sub.types.subTitle
            const errDurations = errService.sub.durations.subTitle

            if (!errItems && !errTypes && !errDurations) {
              const errMainSubTitle = errService.main.subTitle
              errMainSubTitle.status = true
              errMainSubTitle.message = "Please create an main service"
            }
          }
        }
      }
    },

    // CREATE
    async createSubServiceItem(){
      try {
        const objConfig = this.config
        const serviceItem = this.services.sub.items
        const dataItem = this.modal.detail[1]
        const configCraeteItem = {
          method: 'POST',
          url: objConfig.url + objConfig.endpointV1 + "serviceitems",
          headers: objConfig.headers,
          data: {
            item_name: dataItem.item_name.value
          }
        }
        
        const data = await axios(configCraeteItem)
        const dataCreate = data.data.data
        serviceItem.push(dataCreate)
        this.createNotif("success","Create Sub Service Item Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Create Sub Service Item Failed")
        }
      }
    },

    async createSubServiceType(){
      try {
        const objConfig = this.config
        const serviceType = this.services.sub.types
        const dataType = this.modal.detail[2]
        const configCraeteType = {
          method: 'POST',
          url: objConfig.url + objConfig.endpointV1 + "servicetypes",
          headers: objConfig.headers,
          data: {
            service_name: dataType.service_name.value,
            description: dataType.description.value
          }
        }
        
        const data = await axios(configCraeteType)
        const dataCreate = data.data.data
        serviceType.push(dataCreate)
        this.createNotif("success","Create Sub Service Type Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Create Sub Service Type Failed")
        }
      }
    },

    async createSubServiceDuration(){
      try {
        const objConfig = this.config
        const serviceDuration = this.services.sub.durations
        const dataDuration = this.modal.detail[3]
        const configCraeteDuration = {
          method: 'POST',
          url: objConfig.url + objConfig.endpointV1 + "servicedurations",
          headers: objConfig.headers,
          data: {
            duration_name: dataDuration.duration_name.value,
            hour: dataDuration.hour.value,
            description: dataDuration.description.value
          }
        }
        
        const data = await axios(configCraeteDuration)
        const dataCreate = data.data.data
        serviceDuration.push(dataCreate)
        this.createNotif("success","Create Sub Service Duration Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Create Sub Service Duration Failed")
        }
      }
    },

    // UPDATE
    async updateSubServiceItem(){
      try {
        const objConfig = this.config
        const dataItem = this.modal.detail[1]
        const serviceItem = this.services.sub.items[dataItem.index]
        const configUpdateItem = {
          method: 'PUT',
          url: objConfig.url + objConfig.endpointV1 + "serviceitems/" + dataItem.id,
          headers: objConfig.headers,
          data: {
            item_name: dataItem.item_name.value
          }
        }

        await axios(configUpdateItem)
        serviceItem.item_name = dataItem.item_name.value
        this.createNotif("success","Update Sub Service Item Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Create Sub Service Item Failed")
        }
      }
    },

    async updateSubServiceType(){
      try {
        const objConfig = this.config
        const dataType = this.modal.detail[2]
        const serviceType = this.services.sub.types[dataType.index]
        const configUpdateType = {
          method: 'PUT',
          url: objConfig.url + objConfig.endpointV1 + "servicetypes/" + dataType.id,
          headers: objConfig.headers,
          data: {
            service_name: dataType.service_name.value,
            description: dataType.description.value
          }
        }

        await axios(configUpdateType)
        serviceType.service_name = dataType.service_name.value
        serviceType.description = dataType.description.value
        this.createNotif("success","Update Sub Service Type Successfully")
      } catch (error) {
        console.log("COK");
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Create Sub Service Item Failed")
        }
      }
    },

    async updateSubServiceDuration(){
      try {
        const objConfig = this.config
        const dataDuration = this.modal.detail[3]
        const serviceDuration = this.services.sub.durations[dataDuration.index]
        const configUpdateDuration = {
          method: 'PUT',
          url: objConfig.url + objConfig.endpointV1 + "servicedurations/" + dataDuration.id,
          headers: objConfig.headers,
          data: {
            duration_name: dataDuration.duration_name.value,
            hour: dataDuration.hour.value,
            description: dataDuration.description.value
          }
        }

        await axios(configUpdateDuration)
        serviceDuration.duration_name = dataDuration.duration_name.value
        serviceDuration.hour = dataDuration.hour.value
        serviceDuration.description = dataDuration.description.value
        this.createNotif("success","Update Sub Service Duration Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Create Sub Service Item Failed")
        }
      }
    },

    async deleteSubServiceItem() {
      try {
        const objConfig = this.config
        const dataItem = this.modal.detail[1]
        const configDeteleItem = {
          method: 'DELETE',
          url: objConfig.url + objConfig.endpointV1 + "serviceitems/" + dataItem.id,
          headers: objConfig.headers
        }

        await axios(configDeteleItem)
        this.createNotif("success","Delete Sub Service Item Successfully")        
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Delete Sub Service Item Failed")
        }
      }
    },

    async deleteSubServiceType() {
      try {
        const objConfig = this.config
        const dataType = this.modal.detail[2]
        const configDeteleType = {
          method: 'DELETE',
          url: objConfig.url + objConfig.endpointV1 + "servicetypes/" + dataType.id,
          headers: objConfig.headers
        }

        await axios(configDeteleType)
        this.createNotif("success","Delete Sub Service Type Successfully")        
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Delete Sub Service Type Failed")
        }
      }
    },

    async deleteSubServiceDuration() {
      try {
        const objConfig = this.config
        const dataDuration = this.modal.detail[3]
        const configDeteleDuration = {
          method: 'DELETE',
          url: objConfig.url + objConfig.endpointV1 + "servicedurations/" + dataDuration.id,
          headers: objConfig.headers
        }

        await axios(configDeteleDuration)
        this.createNotif("success","Delete Sub Service Duration Successfully")        
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Delete Sub Service Duration Failed")
        }
      }
    },

    async createMainService() {
      try {
        const objConfig = this.config
        const dataMainService = this.modal.detail[0]
        const serviceMain = this.services.main
        const configCreateMain = {
          method: 'POST',
          url: objConfig.url + objConfig.endpointV1 + 'services',
          headers: objConfig.headers,
          data: {
            rate: dataMainService.rate.value,
            serviceTypeId: dataMainService.type.value,
            serviceItemId: dataMainService.item.value,
            serviceDurationId: dataMainService.duration.value,
          }
        }

        const data = await axios(configCreateMain)
        const dataCreate = data.data.data
        const injectData = {
          id: dataCreate.id,
          rate: dataCreate.rate,
          serviceType: dataCreate.service_type,
          serviceItem: dataCreate.service_item,
          serviceDuration: dataCreate.service_duration,
        }
        serviceMain.push(injectData)
        this.createNotif("success","Create Main Service Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Create Main Service Failed")
        }
      }
    },

    async updateMainService() {
      try {
        const objConfig = this.config
        const dataMain = this.modal.detail[0]
        const service = this.services
        const serviceSub = service.sub
        const serviceMain = service.main[dataMain.index]
        const configUpdateMain = {
          method: 'PUT',
          url: objConfig.url + objConfig.endpointV1 + "services/" + dataMain.id,
          headers: objConfig.headers,
          data: {
            rate: dataMain.rate.value,
            serviceTypeId: dataMain.type.value,
            serviceItemId: dataMain.item.value,
            serviceDurationId: dataMain.duration.value,
          }
        }

        await axios(configUpdateMain)
        const dataItem = serviceSub.items.find(item => item.id === dataMain.item.value)
        const dataType = serviceSub.types.find(type => type.id === dataMain.type.value)
        const dataDuration = serviceSub.durations.find(duration => duration.id === dataMain.duration.value)

        serviceMain.serviceItem = dataItem
        serviceMain.serviceType = dataType
        serviceMain.serviceDuration = dataDuration
        serviceMain.rate = dataMain.rate.value
        this.createNotif("success","Update Main Service Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Update Main Service Failed")
        }
      }
    }, 

    async deleteMainService() {
      try {
        const objConfig = this.config
        const dataMain = this.modal.detail[0]
        const configDeleteMain = {
          method: 'DELETE',
          url: objConfig.url + objConfig.endpointV1 + "services/" + dataMain.id,
          headers: objConfig.headers,
        }

        await axios(configDeleteMain)
        this.createNotif("success","Delete Main Service Successfully")
      } catch (error) {
        console.log(error.message);
        const codeError = error.code || error.status
        if (codeError === "ERR_NETWORK") {
          this.createNotif("error", "Service Error, Delete Main Service Failed")
        }
      }
    }

  }

};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input.no-arrows::-webkit-outer-spin-button,
input.no-arrows::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>