<template>
  <v-container class="pa-0" fill-height fluid>
    <v-row no-gutters align="center">
      <v-col align="center">
        <v-card width="250" flat class="ma-10" id="transparent" @keyup.enter="mLogIn()">
          <v-card-title>
            <v-img
              transition="scroll-y-reverse-transition"
              contain
              lazy-src="../assets/Images/login.png"
              src="../assets/Images/login.png"
            ></v-img>
          </v-card-title>

          <v-card-text>
            <a-input v-model="strUser" placeholder="input username">
              <a-icon slot="prefix" type="user" />
            </a-input>
            <a-input-password class="mt-2" v-model="strPassword" placeholder="input password">
              <a-icon slot="prefix" type="key" />
            </a-input-password>

            <a-button class="mt-3" icon="login" @click="mLogIn()" block type="primary">Login</a-button>
            <v-col class="pa-0 mt-2" align="center">
              <span class="text-center grey--text">Don't have an account?</span>
              <v-btn text small color="primary" @click="mSignUp()">Sign Up</v-btn>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <a-modal v-model="dialogSignUp" centered title="Sign Up" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="dialogSignUp=false">Cancel</a-button>
        <a-button
          :disabled="mCheckSignUp()"
          key="submit"
          icon="save"
          type="primary"
          @click="mAddUser()"
        >Sign In</a-button>
      </template>
      <a-form layout="inline" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item labelAlign="left" label="First Name" required style="width:100%">
          <a-input v-model="objNewUserData.FirstName"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Middle Name" required style="width:100%">
          <a-input v-model="objNewUserData.MiddleName"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Last Name" required style="width:100%">
          <a-input v-model="objNewUserData.LastName"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Email Address" required style="width:100%">
          <a-input v-model="objNewUserData.EmailAddress" suffix="@gmail.com"></a-input>
        </a-form-item>
        <!-- <a-form-item labelAlign="left" label="User Type" required style="width:100%">
          <a-select disabled v-model="objNewUserData.SectionID" allowClear>
            <a-select-option v-for="i in gObjType" :key="i.id" :value="i.id">{{i.name}}</a-select-option>
          </a-select>
        </a-form-item>-->
        <a-form-item labelAlign="left" label="UserName" required style="width:100%">
          <a-input v-model="objNewUserData.Username"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Password" required style="width:100%">
          <a-input-password v-model="objNewUserData.UserPassword"></a-input-password>
        </a-form-item>
        <a-form-item labelAlign="left" label="ConfirmPassword" required style="width:100%">
          <a-input type="Password" v-model="objNewUserData.ConfirmUserPassword">
            <a-tooltip slot="suffix" title="Password not match.">
              <a-icon
                theme="twoTone"
                two-tone-color="red"
                v-if="objNewUserData.ConfirmUserPassword!=objNewUserData.UserPassword"
                type="info-circle"
                style="color: rgba(0,0,0,.45)"
              />
            </a-tooltip>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  data() {
    return {
      dialogSignUp: false,
      Password: "",
      strUser: "",
      strPassword: "",
      objNewUserData: {},
      isShowPassword: false
    };
  },
  created() {
    this.$notification.config({
      placement: "bottomRight",
      duration: 3
    });
  },
  methods: {
    mLogIn() {
      axios
        .get(this.url + `login/` + this.strUser)
        .then(res => {
          let userdata = res.data;
          if (userdata.length != 0) {
            if (userdata[0].UserType == 0) {
              this.$notification.error({
                message: this.gSystemTitle,
                description: "User not yet approve by administrator !"
              });
            } else {
              if (this.strPassword == userdata[0].Password) {
                this.$store.commit("cSales_product", []);
                this.$store.commit("cUserData", userdata);
                this.$store.commit("cIntHome", 0);
                this.$store.commit("cMasterID", 1);
                this.$store.commit("cReportID", 1);
                this.$store.commit("cProductID", 1);
                location.reload();
              } else {
                this.$notification.error({
                  message: this.gSystemTitle,
                  description: "Invalid Password."
                });
              }
            }
          } else {
            this.$notification.error({
              message: this.gSystemTitle,
              description: "Invalid User."
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    mAddUser() {
      axios.post(this.url + `insertusers/`, this.objNewUserData).then(res => {
        if (res.data.ID == this.objNewUserData.ID) {
          this.$notification.success({
            message: this.gSystemTitle,
            description: "Successfuly Sign In."
          });
          this.dialogSignUp = false;
        } else {
          this.$notification.error({
            message: this.gSystemTitle,
            description: "Error in Sign In.Please try again."
          });
        }
      });
    },
    mSignUp() {
      this.objNewUserData = {};
      this.objNewUserData.UserType = 0;
      this.objNewUserData.Emailsuffix = "@gmail.com";
      this.dialogSignUp = true;
    },
    mCheckSignUp() {
      if (
        this.objNewUserData.FirstName == undefined ||
        this.objNewUserData.FirstName == "" ||
        this.objNewUserData.MiddleName == undefined ||
        this.objNewUserData.MiddleName == "" ||
        this.objNewUserData.LastName == undefined ||
        this.objNewUserData.LastName == "" ||
        this.objNewUserData.EmailAddress == undefined ||
        this.objNewUserData.EmailAddress == "" ||
        this.objNewUserData.Username == undefined ||
        this.objNewUserData.Username == "" ||
        this.objNewUserData.UserPassword == undefined ||
        this.objNewUserData.UserPassword == "" ||
        this.objNewUserData.ConfirmUserPassword == undefined ||
        this.objNewUserData.ConfirmUserPassword == ""
      ) {
        return true;
      } else {
        if (
          this.objNewUserData.UserPassword ==
          this.objNewUserData.ConfirmUserPassword
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
};
</script>