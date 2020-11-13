<template>
  <v-container fluid fill-height>
    <v-row align="center" jsutify="center" no-gutters>
      <v-col cols="6" align="right">
        <v-hover v-slot:default="{ hover }">
          <v-card width="200" @click="mTo(1)" :elevation="hover ? 12 :0" color="transparent">
            <v-img height="200" contain src="../assets/Images/sales.png"></v-img>
          </v-card>
        </v-hover>
      </v-col>
      <v-col cols="6" align="left">
        <v-hover v-slot:default="{ hover }">
          <v-card
            :disabled="cUserType!='Admin'"
            width="200"
            @click="mTo(2)"
            :elevation="hover ? 12 :0"
            color="transparent"
          >
            <v-img height="200" contain src="../assets/Images/products.png"></v-img>
          </v-card>
        </v-hover>
      </v-col>
      <v-col cols="6" align="right">
        <v-hover v-slot:default="{ hover }">
          <v-card width="200" @click="mTo(3)" :elevation="hover ? 12 :0" color="transparent">
            <v-img height="200" contain src="../assets/Images/reports.png"></v-img>
          </v-card>
        </v-hover>
      </v-col>
      <v-col cols="6" align="left">
        <v-hover v-slot:default="{ hover }">
          <v-card
            :disabled="cUserType!='Admin'"
            width="200"
            @click="mTo(4)"
            :elevation="hover ? 12 :0"
            color="transparent"
          >
            <v-img height="200" contain src="../assets/Images/master.png"></v-img>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      userType: 0,
      title: [
        {
          id: 1,
          title: "SALES",
          to: "sales",
          img: "../assets/Images/sales.png"
        },
        {
          id: 2,
          title: "PRODUCT",
          to: "products",
          img: "../assets/Images/products.png"
        },
        {
          id: 3,
          title: "REPORT",
          to: "reports",
          img: "../assets/Images/reports.png"
        },
        {
          id: 4,
          title: "MASTER",
          to: "master",
          img: "../assets/Images/master.png"
        }
      ]
    };
  },
  created() {
    this.$notification.info({
      message: this.gSystemTitle,
      description: "Hi " + this.cUserName + "."
    });
  },
  computed: {},
  methods: {
    mTo(id) {
      this.$store.commit("cIntHome", id);
    }
  }
};
</script>

