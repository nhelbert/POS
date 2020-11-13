<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="mFilterUsers()"
      item-key="ID"
      class="transparent"
      :page.sync="intpage"
      hide-default-footer
      @page-count="intpageCount = $event"
    >
      <template v-slot:top>
        <v-row class="space-around" justify="center">
          <v-col cols="auto">
            <v-text-field
              dense
              hide-details
              solo
              v-model="strFilterName"
              label="Search name"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              dense
              hide-details
              solo
              v-model="strFilterEmail"
              label="Search email"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.Fname="{ item }">
        <span v-if="strFilterName">
          <template
            v-for="(fragment, i) in item.Fname.toString().split(new RegExp(`(?<=${strFilterName})|(?=${strFilterName})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterName.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.Fname}}</template>
      </template>
      <template v-slot:item.Mname="{ item }">
        <span v-if="strFilterName">
          <template
            v-for="(fragment, i) in item.Mname.toString().split(new RegExp(`(?<=${strFilterName})|(?=${strFilterName})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterName.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.Mname}}</template>
      </template>
      <template v-slot:item.Lname="{ item }">
        <span v-if="strFilterName">
          <template
            v-for="(fragment, i) in item.Lname.toString().split(new RegExp(`(?<=${strFilterName})|(?=${strFilterName})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterName.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.Lname}}</template>
      </template>
      <template v-slot:item.Email="{ item }">
        <span v-if="strFilterEmail">
          <template
            v-for="(fragment, i) in item.Email.toString().split(new RegExp(`(?<=${strFilterEmail})|(?=${strFilterEmail})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterEmail.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}@gmail.com</mark>
            <template v-else>{{fragment}}@gmail.com</template>
          </template>
        </span>
        <template v-else>{{item.Email}}@gmail.com</template>
      </template>
      <template v-slot:item.action="{item}">
        <v-icon color="purple" @click="mEdit(item)">mdi-pencil-box</v-icon>
        <a-popconfirm placement="topRight" ok-text="Yes" cancel-text="No" @confirm="mdeleteitem()">
          <template slot="title">
            <p>Delete this Item ?</p>
          </template>
          <v-icon color="red" @click="mSelectitem(item)">mdi-delete</v-icon>
        </a-popconfirm>
      </template>
      <template v-slot:item.UserType="{item}">{{mgetUserType(item)}}</template>
      <template v-slot:footer>
        <v-row justify="space-around">
          <v-col align="center" cols="auto" class="pa-0">
            <v-pagination
              v-model="intpage"
              :length="intpageCount"
              prev-icon="mdi-menu-left"
              next-icon="mdi-menu-right"
            ></v-pagination>
          </v-col>
        </v-row>
      </template>
    </v-data-table>

    <!-- <v-dialog v-model="dialogEdit" persistent max-width="700px">
      <v-card id="card">
        <v-card-title>
          <span style="color:blue">Edit User</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field dense outlined hide-details v-model="strFirstName" label="FirstName"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field dense outlined hide-details v-model="strMiddleName" label="MiddleName"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field dense outlined hide-details v-model="strLastName" label="LastName"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="strEmailAddress"
                label="EmailAddress"
                suffix="@gmail.com"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                label="User Type"
                v-model="intUserType"
                :items="userType"
                item-text="name"
                item-value="id"
                dense
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field dense outlined hide-details v-model="strUsername" label="UserName"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :append-icon="isShowPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="isShowPassword ? 'text' : 'password'"
                dense
                outlined
                hide-details
                v-model="strUserPassword"
                label="Password"
                @click:append="isShowPassword = !isShowPassword"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="error" block class="mt-2" @click="dialogEdit = false">Cancel</v-btn>
            </v-col>
            <v-col>
              <v-btn
                :disabled="mCheckEdit()"
                color="primary"
                block
                class="mt-2"
                @click="mUpdateUser()"
              >
                <v-icon>mdi-content-save-edit</v-icon>Update
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>-->
    <a-modal v-model="dialogEdit" centered title="Edit User" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="dialogEdit=false">Cancel</a-button>
        <a-button
          :disabled="mCheckEdit()"
          key="submit"
          icon="save"
          type="primary"
          @click="mUpdateUser()"
        >Update</a-button>
      </template>
      <a-form layout="inline" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item labelAlign="left" label="First Name" required style="width:100%">
          <a-input v-model="strFirstName"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Middle Name" required style="width:100%">
          <a-input v-model="strMiddleName"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Last Name" required style="width:100%">
          <a-input v-model="strLastName"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Email Address" required style="width:100%">
          <a-input v-model="strEmailAddress" suffix="@gmail.com"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="User Type" required style="width:100%">
          <a-select v-model="intUserType" allowClear>
            <a-select-option v-for="i in gObjType" :key="i.id" :value="i.id">{{i.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item labelAlign="left" label="UserName" required style="width:100%">
          <a-input v-model="strUsername"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Password" required style="width:100%">
          <a-input-password v-model="strUserPassword"></a-input-password>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="dialogAdd" centered title="Add New User" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="dialogAdd=false">Cancel</a-button>
        <a-button
          :disabled="mCheckAdd()"
          key="submit"
          icon="save"
          type="primary"
          @click="mAddUser()"
        >Save</a-button>
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
        <a-form-item labelAlign="left" label="User Type" required style="width:100%">
          <a-select v-model="objNewUserData.UserType" allowClear>
            <a-select-option v-for="i in gObjType" :key="i.id" :value="i.id">{{i.name}}</a-select-option>
          </a-select>
        </a-form-item>
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

    <!-- <v-dialog v-model="dialogAdd" persistent max-width="700px">
      <v-card id="card">
        <v-card-title>
          <span style="color:blue">Add New User</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewUserData.FirstName"
                label="FirstName"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewUserData.MiddleName"
                label="MiddleName"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewUserData.LastName"
                label="LastName"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewUserData.EmailAddress"
                label="EmailAddress"
                suffix="@gmail.com"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                label="User Type"
                v-model="objNewUserData.UserType"
                :items="userType"
                item-text="name"
                item-value="id"
                dense
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewUserData.Username"
                label="UserName"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :append-icon="isShowPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="isShowPassword ? 'text' : 'password'"
                dense
                outlined
                hide-details
                v-model="objNewUserData.UserPassword"
                label="Password"
                @click:append="isShowPassword = !isShowPassword"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="password"
                dense
                outlined
                hide-details="auto"
                v-model="objNewUserData.ConfirmUserPassword"
                label="ConfirmPassword"
                :append-icon="objNewUserData.ConfirmUserPassword!=objNewUserData.UserPassword ? 'mdi-alert-circle' : ''"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="error" block class="mt-2" @click="dialogAdd = false">Cancel</v-btn>
            </v-col>
            <v-col>
              <v-btn :disabled="mCheckAdd()" color="primary" block class="mt-2" @click="mAddUser()">
                <v-icon>mdi-content-save-edit</v-icon>Save
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>-->

    <v-btn bottom color="green" dark fab fixed right @click="mAddNew()">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dialogEdit: false,
      dialogAdd: false,
      isDelete: false,
      isShowPassword: false,
      intpageCount: 0,
      intpage: 1,
      strId: "",
      strFirstName: "",
      strMiddleName: "",
      strLastName: "",
      strEmailAddress: "",
      strFilterName: "",
      strFilterEmail: "",
      intUserType: "",
      strUsername: "",
      strUserPassword: "",
      strEmailsuffix: "",
      objNewUserData: {},
      objItem: [],
      users: [],
      userType: [
        { id: 0, name: "Not yet approve" },
        { id: 1, name: "Admin" },
        { id: 2, name: "Cashier" }
      ],
      headers: [
        {
          text: "First Name",
          align: "center",
          value: "Fname"
        },
        {
          text: "Middle Name",
          align: "center",
          value: "Mname"
        },
        {
          text: "Last Name",
          align: "center",
          value: "Lname"
        },
        {
          text: "Email",
          align: "center",
          value: "Email"
        },
        {
          text: "User Type",
          align: "center",
          value: "UserType"
        },
        {
          text: "",
          align: "center",
          value: "action"
        }
      ]
    };
  },
  created() {
    this.mGetData();
  },
  methods: {
    mGetData() {
      axios.get(this.url + `users`).then(res => {
        this.users = res.data;
      });
    },
    mgetUserType(item) {
      let Find = this.userType.find(find => find.id == item.UserType);
      return Find.name;
    },
    mFilterUsers() {
      return this.users.filter(data => {
        return (
          (data.Fname.toUpperCase().includes(
            this.strFilterName.toUpperCase()
          ) ||
            data.Mname.toUpperCase().includes(
              this.strFilterName.toUpperCase()
            ) ||
            data.Lname.toUpperCase().includes(
              this.strFilterName.toUpperCase()
            )) &&
          data.Email.toUpperCase().includes(this.strFilterEmail.toUpperCase())
        );
      });
    },
    mEdit(item) {
      this.strId = item.ID;
      this.strFirstName = item.Fname;
      this.strMiddleName = item.Mname;
      this.strLastName = item.Lname;
      this.strEmailAddress = item.Email;
      this.intUserType = item.UserType;
      this.strUsername = item.Username;
      this.strUserPassword = item.Password;
      this.dialogEdit = true;
    },
    mAddNew() {
      this.objNewUserData = {};
      this.objNewUserData.UserType = 0;
      this.dialogAdd = true;
    },
    mSelectitem(item) {
      this.isDelete = true;
      this.objItem = item;
    },
    mUpdateUser() {
      this.objNewUserData = {};
      this.objNewUserData.ID = this.strId;
      this.objNewUserData.FirstName = this.strFirstName;
      this.objNewUserData.MiddleName = this.strMiddleName;
      this.objNewUserData.LastName = this.strLastName;
      this.objNewUserData.EmailAddress = this.strEmailAddress;
      this.objNewUserData.Emailsuffix = this.strEmailsuffix;
      this.objNewUserData.Username = this.strUsername;
      this.objNewUserData.UserPassword = this.strUserPassword;
      this.objNewUserData.UserType = this.intUserType;
      axios.post(this.url + `updateusers/`, this.objNewUserData).then(res => {
        if (res.data.ID == this.objNewUserData.ID) {
          this.$notification.success({
            message: this.gSystemTitle,
            description: "Successfully Update."
          });
        } else {
          this.$notification.error({
            message: this.gSystemTitle,
            description: "Error in Update.Please try again."
          });
        }
        this.mGetData();
        this.dialogEdit = false;
      });
    },
    mCheckEdit() {
      if (
        this.strFirstName == "" ||
        this.strMiddleName == "" ||
        this.strLastName == "" ||
        this.strEmailAddress == "" ||
        this.strUsername == "" ||
        this.strUserPassword == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    mCheckAdd() {
      if (
        this.objNewUserData.FirstName == undefined ||
        this.objNewUserData.FirstName == "" ||
        this.objNewUserData.MiddleName == undefined ||
        this.objNewUserData.MiddleName == "" ||
        this.objNewUserData.LastName == undefined ||
        this.objNewUserData.LastName == "" ||
        this.objNewUserData.EmailAddress == undefined ||
        this.objNewUserData.EmailAddress == "" ||
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
    },
    mAddUser() {
      axios.post(this.url + `insertusers/`, this.objNewUserData).then(res => {
        if (res.data.ID == this.objNewUserData.ID) {
          this.$notification.success({
            message: this.gSystemTitle,
            description: "Successfully Save."
          });
        } else {
          this.$notification.error({
            message: this.gSystemTitle,
            description: "Error in Save.Please try again."
          });
        }
        this.mGetData();
        this.dialogAdd = false;
      });
    },
    mdeleteitem() {
      axios.post(this.url + `deleteusers/`, this.objItem).then(res => {
        if (res.data.ID == this.objItem.ID) {
          this.$notification.success({
            message: this.gSystemTitle,
            description: "Successfully Delete."
          });
        } else {
          this.$notification.error({
            message: this.gSystemTitle,
            description: "Error in Delete.Please try again."
          });
        }
        this.mGetData();
        this.isDelete = false;
      });
    }
  }
};
</script>
