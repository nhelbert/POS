<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="mFilterSupplier()"
      item-key="supplierId"
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
              v-model="strFilterAddress"
              label="Search address"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              dense
              solo
              hide-details
              v-model="strFilterContact"
              label="Search contact"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.name="{ item }">
        <span v-if="strFilterName">
          <template
            v-for="(fragment, i) in item.name.toString().split(new RegExp(`(?<=${strFilterName})|(?=${strFilterName})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterName.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.name}}</template>
      </template>
      <template v-slot:item.address="{ item }">
        <span v-if="strFilterAddress">
          <template
            v-for="(fragment, i) in item.address.toString().split(new RegExp(`(?<=${strFilterAddress})|(?=${strFilterAddress})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterAddress.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.address}}</template>
      </template>
      <template v-slot:item.contact="{ item }">
        <span v-if="strFilterContact">
          <template
            v-for="(fragment, i) in item.contact.toString().split(new RegExp(`(?<=${strFilterContact})|(?=${strFilterContact})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterContact.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.contact}}</template>
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

    <!-- <v-dialog v-model="dialogEdit" persistent max-width="700px">
      <v-card id="card">
        <v-card-title>
          <span style="color:blue">Edit Supplier</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field dense outlined hide-details v-model="strName" label="Name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field dense outlined hide-details v-model="strAddress" label="Address"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field dense outlined hide-details v-model="strContact" label="Contact"></v-text-field>
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
                @click="mUpdateSupplier()"
              >
                <v-icon>mdi-content-save-edit</v-icon>Update
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>-->
    <a-modal v-model="dialogEdit" centered title="Edit Supplier" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="dialogEdit=false">Cancel</a-button>
        <a-button
          :disabled="mCheckEdit()"
          key="submit"
          icon="save"
          type="primary"
          @click="mUpdateSupplier()"
        >Update</a-button>
      </template>
      <a-form layout="inline" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item labelAlign="left" label="Name" required style="width:100%">
          <a-input v-model="strName"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Address" required style="width:100%">
          <a-input v-model="strAddress"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Contact" required style="width:100%">
          <a-input v-model="strContact"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="dialogAdd" centered title="Add New Supplier" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="dialogAdd=false">Cancel</a-button>
        <a-button
          :disabled="mCheckAdd()"
          key="submit"
          icon="save"
          type="primary"
          @click="mAddSupplier()"
        >Update</a-button>
      </template>
      <a-form layout="inline" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item labelAlign="left" label="Name" required style="width:100%">
          <a-input v-model="objNewSupplierData.name"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Address" required style="width:100%">
          <a-input v-model="objNewSupplierData.address"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Contact" required style="width:100%">
          <a-input v-model="objNewSupplierData.contact"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 
    <v-dialog v-model="dialogAdd" persistent max-width="700px">
      <v-card id="card">
        <v-card-title>
          <span style="color:blue">Add New Supplier</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewSupplierData.name"
                label="Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewSupplierData.address"
                label="Address"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewSupplierData.contact"
                label="Contact"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="error" block class="mt-2" @click="dialogAdd = false">Cancel</v-btn>
            </v-col>
            <v-col>
              <v-btn
                :disabled="mCheckAdd()"
                color="primary"
                block
                class="mt-2"
                @click="mAddSupplier()"
              >
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
      intpageCount: 0,
      intpage: 1,
      strId: "",
      strName: "",
      strAddress: "",
      strContact: "",
      strFilterName: "",
      strFilterAddress: "",
      strFilterContact: "",
      objNewSupplierData: {},
      objItem: {},
      supplier: [],
      headers: [
        {
          text: "Name",
          align: "center",
          value: "name"
        },
        {
          text: "Address",
          align: "center",
          value: "address"
        },
        {
          text: "Contact",
          align: "center",
          value: "contact"
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
      axios.get(this.url + `supplier`).then(res => {
        this.supplier = res.data;
      });
    },
    mgetUserType(item) {
      let Find = this.userType.find(find => find.id == item.UserType);
      return Find.name;
    },
    mFilterSupplier() {
      return this.supplier.filter(data => {
        return (
          data.name.toUpperCase().includes(this.strFilterName.toUpperCase()) &&
          data.address
            .toUpperCase()
            .includes(this.strFilterAddress.toUpperCase()) &&
          data.contact
            .toUpperCase()
            .includes(this.strFilterContact.toUpperCase())
        );
      });
    },
    mEdit(item) {
      this.strId = item.supplierId;
      this.strName = item.name;
      this.strAddress = item.address;
      this.strContact = item.contact;
      this.dialogEdit = true;
    },
    mAddNew() {
      this.objNewSupplierData = {};
      this.dialogAdd = true;
    },
    mSelectitem(item) {
      this.isDelete = true;
      this.objItem = item;
    },
    mUpdateSupplier() {
      this.objNewSupplierData = {};
      this.objNewSupplierData.supplierId = this.strId;
      this.objNewSupplierData.name = this.strName;
      this.objNewSupplierData.address = this.strAddress;
      this.objNewSupplierData.contact = this.strContact;
      axios
        .post(this.url + `updatesupplier/`, this.objNewSupplierData)
        .then(res => {
          if (res.data.supplierId == this.objNewSupplierData.supplierId) {
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
          this.mgetData();
          this.dialogEdit = false;
        });
    },
    mAddSupplier() {
      axios
        .post(this.url + `insertsupplier/`, this.objNewSupplierData)
        .then(res => {
          if (res.data.supplierId == this.objNewSupplierData.supplierId) {
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
          this.mgetData();
          this.dialogAdd = false;
        });
    },
    mCheckAdd() {
      if (
        this.objNewSupplierData.name == undefined ||
        this.objNewSupplierData.name == "" ||
        this.objNewSupplierData.address == undefined ||
        this.objNewSupplierData.address == "" ||
        this.objNewSupplierData.contact == undefined ||
        this.objNewSupplierData.contact == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    mCheckEdit() {
      if (
        this.strName == "" ||
        this.strAddress == "" ||
        this.strContact == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    mdeleteitem() {
      axios.post(this.url + `deletesupplier/`, this.objItem).then(res => {
        if (res.data.supplierId == this.objItem.supplierId) {
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
        this.mgetData();
        this.isDelete = false;
      });
    }
  }
};
</script>