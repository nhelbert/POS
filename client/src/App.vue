<template>
  <v-app id="background">
    <LogIn v-if="!isLogIn"></LogIn>
    <Drawer v-if="isLogIn"></Drawer>
    <v-content id="myContent" v-if="isLogIn">
      <v-slide-y-transition hide-on-leave>
        <router-view />
      </v-slide-y-transition>
    </v-content>
  </v-app>
</template>

<script>
import LogIn from "./views/t_LogIn";
import Drawer from "./components/Drawer";
export default {
  components: {
    LogIn,
    Drawer
  },
  data: () => {
    return {
      isLogIn: false
    };
  },

  created() {
    this.isLogIn = this.mCheckUser();
    setInterval(() => {
      this.mRouter();
    }, 100);
  },
  methods: {
    mCheckUser() {
      if (this.sUserData.length == 0) {
        return false;
      } else {
        return true;
      }
    },
    mRouter() {
      if (
        this.sIntHome == 1 &&
        this.$router.currentRoute.fullPath != "/sales"
      ) {
        this.$router.push("/sales");
      } else if (
        this.sIntHome == 2 &&
        this.$router.currentRoute.fullPath != "/products"
      ) {
        this.$router.push("/products");
      } else if (
        this.sIntHome == 3 &&
        this.$router.currentRoute.fullPath != "/reports"
      ) {
        this.$router.push("/reports");
      } else if (
        this.sIntHome == 4 &&
        this.$router.currentRoute.fullPath != "/master"
      ) {
        this.$router.push("/master");
      }
    }
  }
};
</script>
<style>
#card {
  background-color: white;
  /* background-image: url("./assets/bc1.jpg"); */
  background-size: cover !important;
}
#transparent {
  background-color: transparent !important;
}
#background {
  /* background-color: grey; */
  /* background-image: url("./assets/Images/bc1.jpg"); */
  background: rgba(210, 210, 210, 0.5);
  background-size: cover !important;
  font-family: "Lucida Console";
}
#barcode {
  text-align: center;
  /* background-color: transparent; */
}
#myContent {
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}
/* .myTables thead tr th {
  text-align: center;
  background-color: transparent;
}
.myTables tbody tr td {
  text-align: center;
  background-color: transparent;
}
.myTables {
  background-image: url("./assets/bc1.jpg");
  background-size: cover !important;
} */
html {
  overflow-y: hidden;
}
</style>