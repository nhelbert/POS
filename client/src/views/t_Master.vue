<template>
  <v-container fluid>
    <v-slide-x-transition hide-on-leave>
      <users v-if="sMasterID==1"></users>
      <supplier v-if="sMasterID==2"></supplier>
      <customer v-if="sMasterID==3"></customer>
    </v-slide-x-transition>
  </v-container>
</template>

<script>
import users from "./m_Users";
import supplier from "./m_Supplier";
import customer from "./m_Customer";
import axios from "axios";
export default {
  components: {
    users,

    supplier,
    customer
  },
  data: () => ({
    intNYA: 0,
    dialog: false,
    drawer: null,
    users: [],
    items: [
      {
        id: 1,
        icon: "mdi-account-group",
        text: "Users Master"
      },
      {
        id: 2,
        icon: "mdi-account-multiple",
        text: "Suppliers Master"
      },
      {
        id: 3,
        icon: "mdi-account",
        text: "Customers Master"
      }
    ]
  }),
  computed: {
    cNYA() {
      this.mGetData();
      let userslen = this.users.filter(data => {
        return data.UserType == 0;
      });
      return userslen.length;
    }
  },
  methods: {
    mGetData() {
      axios.get(this.url + `users`).then(res => {
        this.users = res.data;
      });
    },
    mHome() {
      this.$router.push("/");
    },
    mTo(id) {
      this.$store.commit("cMasterID", id);
    },
    mgetTitle() {
      let index = this.items.find(item => item.id == this.sMasterID);
      return this.items[this.items.indexOf(index)].text;
    }
  }
};
</script>
<style>