<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="mFilterItems()"
      item-key="itemcode"
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
              v-model="strFilterItem"
              label="Search"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.itemcode="{ item }">
        <span v-if="strFilterItem">
          <template
            v-for="(fragment, i) in item.itemcode.toString().split(new RegExp(`(?<=${strFilterItem})|(?=${strFilterItem})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterItem.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.itemcode}}</template>
      </template>
      <template v-slot:item.itemname="{ item }">
        <span v-if="strFilterItem">
          <template
            v-for="(fragment, i) in item.itemname.toString().split(new RegExp(`(?<=${strFilterItem})|(?=${strFilterItem})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterItem.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.itemname}}</template>
      </template>

      <template v-slot:item.actualprice="{item}">₱ {{item.actualprice}}</template>
      <template v-slot:item.price="{item}">₱ {{item.price}}</template>
      <template v-slot:item.unitid="{item}">{{mgetUnit(item.unitid)}}</template>
      <template v-slot:item.supplierId="{item}">{{mgetSupplier(item.supplierId)}}</template>
      <template v-slot:item.expiryDate="{ item }">
        <h5>{{moment(item.expiryDate).format("L LT")}}</h5>
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

    <v-dialog v-model="dialogEdit" persistent max-width="700px">
      <v-card id="card">
        <v-card-title>
          <span style="color:blue">Edit Item</span>
        </v-card-title>
        <v-card-text>
          <v-row justify="space-around">
            <v-col cols="12">
              <v-text-field
                class="text-center"
                dense
                outlined
                hide-details
                v-model="stritemcode"
                label="Item Code"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field dense outlined hide-details v-model="stritemname" label="Item Name"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="intactualprice"
                label="Actual Price"
                prefix="₱"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="intprice"
                label="Price"
                prefix="₱"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="intminimumQty"
                label="Minimum Quantity"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="intactualQty"
                label="Actual Quantity"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                label="Unit"
                v-model="intunitid"
                :items="objUnits"
                item-text="unitname"
                item-value="unitid"
                dense
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                label="Supplier"
                v-model="intsupplierId"
                :items="objSupplier"
                item-text="name"
                item-value="supplierId"
                dense
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>

            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="dtexpiryDate"
                label="Expiry Date"
                type="date"
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
                @click="mUpdateItem()"
              >
                <v-icon>mdi-content-save-edit</v-icon>Update
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAdd" persistent max-width="700px">
      <v-card id="card">
        <v-card-title>
          <span style="color:blue">Add New Item</span>
        </v-card-title>
        <v-card-text>
          <v-row justify="space-around">
            <v-col cols="12">
              <v-text-field
                class="text-center"
                dense
                outlined
                hide-details
                v-model="objNewItem.itemcode"
                label="Item Code"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewItem.itemname"
                label="Item Name"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewItem.actualprice"
                label="Actual Price"
                prefix="₱"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewItem.price"
                label="Price"
                prefix="₱"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewItem.minimumQty"
                label="Minimum Quantity"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewItem.actualQty"
                label="Actual Quantity"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                label="Unit"
                v-model="objNewItem.unitid"
                :items="objUnits"
                item-text="unitname"
                item-value="unitid"
                dense
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                label="Supplier"
                v-model="objNewItem.supplierId"
                :items="objSupplier"
                item-text="name"
                item-value="supplierId"
                dense
                outlined
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                hide-details
                v-model="objNewItem.expiryDate"
                label="Expiry Date"
                type="date"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="error" block class="mt-2" @click="dialogAdd = false">Cancel</v-btn>
            </v-col>
            <v-col>
              <v-btn :disabled="mCheckAdd()" color="primary" block class="mt-2" @click="mAddItem()">
                <v-icon>mdi-content-save-edit</v-icon>Save
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-btn bottom color="green" dark fab fixed right @click="mAddNew()">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      dialogEdit: false,
      dialogAdd: false,
      isDelete: false,
      intpageCount: 0,
      intpage: 1,
      strFilterItem: "",
      strFilterUnit: "",
      stritemcode: "",
      stritemname: "",
      intminimumQty: 0,
      intactualQty: 0,
      intactualprice: 0,
      intprice: 0,
      intunitid: 0,
      intsupplierId: 0,
      dtexpiryDate: "",
      items: [],
      objItem: {},
      objUnits: [],
      objSupplier: [],
      objNewItem: {},
      headers: [
        {
          text: "Item Code",
          align: "center",
          value: "itemcode"
        },
        {
          text: "Item Name",
          align: "center",
          value: "itemname"
        },
        {
          text: "Minimum QTY",
          align: "center",
          value: "minimumQty"
        },
        {
          text: "Actual QTY",
          align: "center",
          value: "actualQty"
        },
        {
          text: "Actual Price",
          align: "left",
          value: "actualprice"
        },
        {
          text: "Price",
          align: "left",
          value: "price"
        },
        {
          text: "Unit",
          align: "center",
          value: "unitid"
        },
        {
          text: "Supplier Name",
          align: "center",
          value: "supplierId"
        },
        {
          text: "Expiry Date",
          align: "center",
          value: "expiryDate"
        },
        {
          text: "",
          align: "center",
          sortable: false,
          value: "action"
        }
      ]
    };
  },
  created() {
    this.mGetData();
  },
  methods: {
    moment,
    mGetData() {
      axios.get(this.url + `itemsMaster`).then(res => {
        this.items = res.data;
      });
      axios.get(this.url + `units`).then(res => {
        this.objUnits = res.data;
      });
      axios.get(this.url + `supplier`).then(res => {
        this.objSupplier = res.data;
      });
    },
    mEdit(item) {
      this.objNewItem.itemId = item.itemId;
      this.stritemcode = item.itemcode;
      this.stritemname = item.itemname;
      this.intminimumQty = item.minimumQty;
      this.intactualQty = item.actualQty;
      this.intactualprice = item.actualprice;
      this.intprice = item.price;
      this.intunitid = item.unitid;
      this.intsupplierId = item.supplierId;
      this.dtexpiryDate = moment(item.expiryDate).format("YYYY-MM-DD");
      this.dialogEdit = true;
    },
    mAddNew() {
      this.objNewItem = {};
      this.dialogAdd = true;
    },
    mCheckAdd() {
      if (
        this.objNewItem.itemcode == undefined ||
        this.objNewItem.itemcode == "" ||
        this.objNewItem.itemname == undefined ||
        this.objNewItem.itemname == "" ||
        this.objNewItem.minimumQty == undefined ||
        this.objNewItem.minimumQty == 0 ||
        this.objNewItem.actualQty == undefined ||
        this.objNewItem.actualQty == 0 ||
        this.objNewItem.actualprice == undefined ||
        this.objNewItem.actualprice == 0 ||
        this.objNewItem.price == undefined ||
        this.objNewItem.price == 0 ||
        this.objNewItem.unitid == undefined ||
        this.objNewItem.unitid == 0 ||
        this.objNewItem.supplierId == undefined ||
        this.objNewItem.supplierId == 0 ||
        this.objNewItem.expiryDate == undefined ||
        this.objNewItem.expiryDate == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    mCheckEdit() {
      if (
        this.stritemcode == "" ||
        this.stritemname == "" ||
        this.intminimumQty == 0 ||
        this.intactualQty == 0 ||
        this.intactualprice == 0 ||
        this.intprice == 0 ||
        this.intunitid == 0 ||
        this.intsupplierId == 0 ||
        this.dtexpiryDate == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    mAddItem() {
      axios.post(this.url + `insertitems/`, this.objNewItem).then(res => {
        if (res.data.itemcode == this.objNewItem.itemcode) {
          this.$notification.success({
            message: this.gSystemTitle,
            description: "Successfully Save"
          });
        } else {
          this.$notification.error({
            message: this.gSystemTitle,
            description: "Error in Save.Please try again"
          });
        }
        this.mGetData();
        this.dialogAdd = false;
      });
    },
    mSelectitem(item) {
      this.isDelete = true;
      this.objItem = item;
    },
    mUpdateItem() {
      this.objNewItem.itemcode = this.stritemcode;
      this.objNewItem.itemname = this.stritemname;
      this.objNewItem.minimumQty = this.intminimumQty;
      this.objNewItem.actualQty = this.intactualQty;
      this.objNewItem.actualprice = this.intactualprice;
      this.objNewItem.price = this.intprice;
      this.objNewItem.unitid = this.intunitid;
      this.objNewItem.supplierId = this.intsupplierId;
      this.objNewItem.expiryDate = this.dtexpiryDate;
      axios.post(this.url + `updateitems/`, this.objNewItem).then(res => {
        if (res.data.itemId == this.objNewItem.itemId) {
          this.$notification.success({
            message: this.gSystemTitle,
            description: "Successfully Update"
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
    mFilterItems() {
      return this.items.filter(data => {
        return (
          data.itemcode
            .toUpperCase()
            .includes(this.strFilterItem.toUpperCase()) ||
          data.itemname.toUpperCase().includes(this.strFilterItem.toUpperCase())
        );
      });
    },
    mgetUnit(unitid) {
      let unitName = this.objUnits.find(rec => rec.unitid == unitid);
      if (unitName != undefined) {
        return unitName.unitname;
      } else return "";
    },
    mgetSupplier(supplierId) {
      let supplierName = this.objSupplier.find(
        rec => rec.supplierId == supplierId
      );
      if (supplierName != undefined) {
        return supplierName.name;
      } else return "";
    },
    mdeleteitem() {
      let DateNow = new Date();
      this.objItem.DeletedDate = moment(DateNow).format("YYYY-MM-DD");
      axios.post(this.url + `deleteitems/`, this.objItem).then(res => {
        if (res.data.itemId == this.objItem.itemId) {
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