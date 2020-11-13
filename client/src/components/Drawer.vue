<template>
  <div>
    <v-app-bar color="transparent" dense elevation="1">
      <v-img
        height="50"
        position="left center"
        transition="scroll-y-reverse-transition"
        contain
        lazy-src="../assets/Images/title.png"
        src="../assets/Images/title.png"
      ></v-img>
      <v-spacer></v-spacer>

      <template slot="extension" v-if="sIntHome!=0">
        <v-row dense v-show="sIntHome==1" no-gutter justify="center">
          <v-col cols="auto">{{cUserName}} - {{cUserType}}</v-col>
        </v-row>

        <v-row dense v-show="sIntHome==2" no-gutter justify="center">
          <v-col cols="auto" v-for="(item, i) in objProduct" :key="i">
            <v-btn
              small
              :outlined="item.id==sProductID"
              :color="item.id==sProductID ? 'blue' : 'black'"
              text
              @click="mTo('Product',item.id)"
            >{{item.text}}</v-btn>
          </v-col>
        </v-row>

        <v-row dense v-show="sIntHome==3" no-gutter justify="center">
          <v-col cols="auto" v-for="(item, i) in objReports" :key="i">
            <v-btn
              small
              :outlined="item.id==sReportID"
              :color="item.id==sReportID ? 'blue' : 'black'"
              text
              @click="mTo('Report',item.id)"
            >{{item.text}}</v-btn>
          </v-col>
        </v-row>

        <v-row dense v-show="sIntHome==4" no-gutter justify="center">
          <v-col cols="auto" v-for="(item, i) in objMaster" :key="i">
            <v-btn
              small
              :outlined="item.id==sMasterID"
              :color="item.id==sMasterID ? 'blue' : 'black'"
              text
              @click="mTo('Master',item.id)"
            >{{item.text}}</v-btn>
          </v-col>
        </v-row>
      </template>

      <a-tooltip placement="left" title="Back Home">
        <a-button type="primary" v-show="sIntHome!=0" icon="home" @click="mHome()" />
      </a-tooltip>

      <a-popconfirm placement="bottomRight" ok-text="Yes" cancel-text="No" @confirm="mLogOut">
        <template slot="title">
          <p>Log out Account ?</p>
        </template>
        <a-button v-show="sIntHome==0" type="danger" icon="logout" />
      </a-popconfirm>
    </v-app-bar>
  </div>
</template>

    <script>
export default {
  data() {
    return {
      objReports: [
        {
          id: 1,
          icon: "mdi-paper-roll",
          text: "Transaction History"
        },
        {
          id: 2,
          icon: "mdi-cash",
          text: "Income Monitoring"
        }
      ],
      objMaster: [
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
      ],
      objProduct: [
        {
          id: 1,
          icon: "mdi-finance",
          text: "Items Monitoring"
        }
      ]
    };
  },
  created() {
    this.$notification.config({
      placement: "bottomRight",
      duration: 3
    });
  },
  computed: {},
  methods: {
    mHome() {
      this.$store.commit("cIntHome", 0);
      this.$router.push("/");
    },
    mLogOut() {
      this.$store.commit("cUserData", []);
      location.reload();
    },
    mTo(Type, id) {
      if (Type == "Report") {
        this.$store.commit("cReportID", id);
      } else if (Type == "Master") {
        this.$store.commit("cMasterID", id);
      } else if (Type == "Product") {
        this.$store.commit("cProductID", id);
      }
    }
  }
};
</script>