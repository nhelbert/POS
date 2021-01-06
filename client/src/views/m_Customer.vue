<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="mFilterCustomers()"
      item-key="ID"
      class="transparent"
      :page.sync="intpage"
      hide-default-footer
      @page-count="intpageCount = $event"
    >
      <template v-slot:top>
        <!-- <h3 style="color:blue" class="text-center">Users Master</h3> -->
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
              v-model="strFilterContact"
              label="Search contact"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.Fullname="{ item }">
        <span v-if="strFilterName">
          <template
            v-for="(fragment, i) in item.Fullname.toString().split(new RegExp(`(?<=${strFilterName})|(?=${strFilterName})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterName.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.Fullname}}</template>
      </template>
      <template v-slot:item.Contact="{ item }">
        <span v-if="strFilterContact">
          <template
            v-for="(fragment, i) in item.Contact.toString().split(new RegExp(`(?<=${strFilterContact})|(?=${strFilterContact})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterContact.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.Contact}}</template>
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

    <!-- <h1 class="text-center" v-show="mFilterCustomers().length==0">No record found !</h1>
    <v-row class="mx-2">
      <v-col v-for="item in mFilterCustomers()" :key="item.supplierId" cols="3">
        <v-card id="card">
          <v-card color="blue" class="mx-5 text-center" style="top: -10px">
            <v-card-title>
              <v-icon color="purple" @click="mEdit(item)">mdi-pencil-box</v-icon>
              <v-menu top offset-y transition="scale-transition">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" color="red" @click="mSelectitem(item)">mdi-delete</v-icon>
                </template>
                <v-row no-gutters id="card">
                  <v-col cols="12" class="px-2" align="center">
                    <h4>Delete this Item ?</h4>
                    <v-icon fab>mdi-close</v-icon>
                    <v-icon color="error" @click="mdeleteitem">mdi-delete</v-icon>
                  </v-col>
                </v-row>
              </v-menu>
            </v-card-title>
          </v-card>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12">
                Name :
                <span v-if="strFilterName">
                  <template
                    v-for="(fragment, i) in item.Fullname.toString().split(new RegExp(`(?<=${strFilterName})|(?=${strFilterName})`, 'i'))"
                  >
                    <mark
                      v-if="fragment.toLowerCase() === strFilterName.toLowerCase()"
                      :key="i"
                      class="highlight"
                    >{{fragment}}</mark>
                    <template v-else>{{fragment}}</template>
                  </template>
                </span>
                <template v-else>{{item.Fullname}}</template>
              </v-col>
              <v-col cols="12">
                Contact :
                <span v-if="strFilterContact">
                  <template
                    v-for="(fragment, i) in item.Contact.toString().split(new RegExp(`(?<=${strFilterContact})|(?=${strFilterContact})`, 'i'))"
                  >
                    <mark
                      v-if="fragment.toLowerCase() === strFilterContact.toLowerCase()"
                      :key="i"
                      class="highlight"
                    >{{fragment}}</mark>
                    <template v-else>{{fragment}}</template>
                  </template>
                </span>
                <template v-else>{{item.Contact}}</template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>-->

    <a-modal v-model="dialogEdit" centered title="Edit Customer" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="dialogEdit=false">Cancel</a-button>
        <a-button
          :disabled="mCheckEdit()"
          key="submit"
          icon="save"
          type="primary"
          @click="mUpdateCustomers()"
        >Update</a-button>
      </template>
      <a-form layout="inline" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item labelAlign="left" label="Name" required style="width:100%">
          <a-input v-model="strName"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Contact" required style="width:100%">
          <a-input v-model="strContact"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="dialogAdd" centered title="Add New Customer" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="dialogAdd=false">Cancel</a-button>
        <a-button
          :disabled="mCheckAdd()"
          key="submit"
          icon="save"
          type="primary"
          @click="mAddCustomers()"
        >Add</a-button>
      </template>
      <a-form layout="inline" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item labelAlign="left" label="Name" required style="width:100%">
          <a-input v-model="objNewCustomersData.Fullname"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Contact" required style="width:100%">
          <a-input v-model="objNewCustomersData.Contact"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>

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
      intpageCount: 0,
      intpage: 1,
      strId: "",
      strName: "",
      strAddress: "",
      strContact: "",
      strFilterName: "",
      strFilterContact: "",
      objNewCustomersData: {},
      objItem: {},
      customers: [],
      headers: [
        {
          text: "Name",
          align: "center",
          value: "Fullname"
        },
        {
          text: "Contact",
          align: "center",
          value: "Contact"
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
    this.mgetData();
  },

  methods: {
    mgetData() {
      axios.get(this.url + `customers`).then(res => {
        this.customers = res.data;
      });
    },
    mFilterCustomers() {
      return this.customers.filter(data => {
        return (
          data.Fullname.toUpperCase().includes(
            this.strFilterName.toUpperCase()
          ) &&
          data.Contact.toUpperCase().includes(
            this.strFilterContact.toUpperCase()
          )
        );
      });
    },
    mEdit(item) {
      this.strId = item.ID;
      this.strName = item.Fullname;
      this.strContact = item.Contact;
      this.dialogEdit = true;
    },
    mAddNew() {
      this.objNewCustomersData = {};
      this.dialogAdd = true;
    },
    mSelectitem(item) {
      this.isDelete = true;
      this.objItem = item;
    },
    mUpdateCustomers() {
      this.objNewCustomersData = {};
      this.objNewCustomersData.ID = this.strId;
      this.objNewCustomersData.FullName = this.strName;
      this.objNewCustomersData.Contact = this.strContact;
      axios
        .post(this.url + `updatecustomers/`, this.objNewCustomersData)
        .then(res => {
          if (res.data.ID == this.objNewCustomersData.ID) {
            this.$notification.success({
              message: this.gSystemTitle,
              description: "Successfully Update."
            });
          } else {
            this.$notification.console.error({
              message: this.gSystemTitle,
              description: "Error in Update.Please try again."
            });
          }
          this.mgetData();
          this.dialogEdit = false;
        });
    },
    mAddCustomers() {
      axios
        .post(this.url + `insertcustomers/`, this.objNewCustomersData)
        .then(res => {
          if (res.data.Fullname == this.objNewCustomersData.Fullname) {
            this.$notification.success({
              message: this.gSystemTitle,
              description: "Successfully Save."
            });
          } else {
            this.$notification.console.error({
              message: this.gSystemTitle,
              description: "Error in Save.Please try again."
            });
          }
          this.mgetData();
          this.dialogAdd = false;
        });
    },
    mCheckAdd() {
      if (
        this.objNewCustomersData.Fullname == undefined ||
        this.objNewCustomersData.Fullname == "" ||
        this.objNewCustomersData.Contact == undefined ||
        this.objNewCustomersData.Contact == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    mCheckEdit() {
      if (this.strName == "" || this.strContact == "") {
        return true;
      } else {
        return false;
      }
    },
    mdeleteitem() {
      axios.post(this.url + `deletecustomers/`, this.objItem).then(res => {
        if (res.data.ID == this.objItem.ID) {
          this.$notification.success({
            message: this.gSystemTitle,
            description: "Successfully Delete."
          });
        } else {
          this.$notification.console.error({
            message: this.gSystemTitle,
            description: "Error in Delete.Please try again."
          });
        }
        this.mgetData();
        this.isDelete = false;
      });
    }
  }
};
</script>
