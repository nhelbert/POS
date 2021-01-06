<template>
  <div>
    <v-row justify="space-around" class="ma-0">
      <v-col cols="4">
        <v-card id="MyCard">
          <v-card-title>Item Monitoring</v-card-title>
          <v-card-text>
            <a-input-search placeholder="Search" @input="mChangeSearch()" v-model="strFilterItem"></a-input-search>
            <a-list
              class="mt-2"
              id="MyDiv2"
              size="small"
              item-layout="horizontal"
              :data-source="cFilterItems"
              bordered
            >
              <a-list-item
                :id="mChangeSpace(item.itemcode)"
                :style="`background-color:${item.itemcode==stritemcode?'#90CAF9':''}`"
                slot="renderItem"
                slot-scope="item"
              >
                <a-list-item-meta @click="mEdit(item)">
                  <span slot="title">
                    <span
                      :style="`color:${item.actualQty <(item.minimumQty /2) ? 'red':''}`"
                    >{{`Item Name:`}}{{item.itemname}}</span>
                  </span>
                  <span slot="description">
                    {{`Item Code:`}}
                    {{item.itemcode}}
                    <!-- {{`Minimum QTY:`}}
                <span
                  class="black--text"
                >{{item.minimumQty +' '+ mgetUnit(item.unitid)}}</span>
                |
                {{`Actual QTY:`}}
                <span
                  class="black--text"
                >{{item.actualQty +' '+ mgetUnit(item.unitid)}}</span>
                |
                {{`Supplier:`}}
                <span
                  class="black--text"
                >{{mgetSupplier(item.supplierId)}}</span>
                |
                {{`Expiry:`}}
                <span
                  class="black--text"
                    >{{moment(item.expiryDate).format("L")}}</span>-->
                  </span>
                </a-list-item-meta>
                <!-- <div slot="extra">
              <v-icon color="purple" @click="mEdit(item)">mdi-pencil-box</v-icon>
              <a-popconfirm
                placement="topRight"
                ok-text="Yes"
                cancel-text="No"
                @confirm="mdeleteitem()"
              >
                <template slot="title">
                  <p>Delete this Item ?</p>
                </template>
                <v-icon color="red" @click="mSelectitem(item)">mdi-delete</v-icon>
              </a-popconfirm>
                </div>-->
              </a-list-item>
            </a-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card id="MyCard">
          <v-card-text>
            <a-result
              v-if="cFilterItems.length==0"
              status="404"
              title="No Data Found"
              :sub-title="`${strFilterItem !='' ? 'No search found for '  + strFilterItem +'.': 'Please add item.'}`"
            >
              <template #extra>
                <a-button
                  v-if="strFilterItem !=''"
                  @click="strFilterItem=''"
                  type="primary"
                >Clear Filter</a-button>
                <a-button @click="mAddNew()" style="background-color:green;color:white">Add New Item</a-button>
              </template>
            </a-result>
            <v-card v-if="cFilterItems.length!=0" color="#632175">
              <v-row justify="space-around">
                <v-col cols="auto">
                  <a-statistic title="Actual Price" :value="intactualprice" :precision="2">
                    <template #prefix>
                      <span>₱</span>
                    </template>
                  </a-statistic>
                </v-col>
                <v-col cols="auto">
                  <a-statistic title="Price" :value="intprice" :precision="2">
                    <template #prefix>
                      <span>₱</span>
                    </template>
                  </a-statistic>
                </v-col>
              </v-row>
            </v-card>
            <v-card v-if="cFilterItems.length!=0" color="#3b2e5a" class="mt-2">
              <v-row justify="space-around">
                <v-col cols="auto">
                  <a-statistic
                    :precision="2"
                    title="Percentage"
                    :value="cPercentage"
                    suffix="%"
                    :value-style="{color : `${intactualQty<(intminimumQty/2) ? 'red':'#3f8600'}` }"
                    style="margin-right: 50px"
                  >
                    <template #prefix>
                      <a-icon v-if="intactualQty<(intminimumQty/2)" type="arrow-down" />
                      <a-icon v-else type="arrow-up" />
                    </template>
                  </a-statistic>
                </v-col>
                <v-col cols="auto">
                  <a-statistic :precision="2" title="Actual Quantity" :value="intactualQty">
                    <template #suffix>
                      <span>{{mgetUnit(intunitid)}}</span>
                    </template>
                  </a-statistic>
                </v-col>
                <v-col cols="auto">
                  <a-statistic :precision="2" title="Maximum Quantity" :value="intminimumQty">
                    <template #suffix>
                      <span>{{mgetUnit(intunitid)}}</span>
                    </template>
                  </a-statistic>
                </v-col>
              </v-row>
            </v-card>
            <v-row v-if="cFilterItems.length!=0" no-gutters>
              <v-col cols="5">
                <v-card color="#394989" class="mt-2 mr-2">
                  <v-card-title class="blue--text">
                    <v-spacer></v-spacer>
                    <v-icon left color="blue">mdi-plus-outline</v-icon>Add Quantity
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <v-card-text>
                    <a-form layout="vertical">
                      <a-form-item
                        class="mb-0"
                        labelAlign="left"
                        label="Input Quantity :"
                        style="width:100%"
                      >
                        <a-input-number
                          id="barcode"
                          :min="0"
                          style="width:100%"
                          v-model="intAddQty"
                        />
                      </a-form-item>
                    </a-form>

                    <v-row justify="space-around">
                      <v-col cols="6">
                        <a-button
                          block
                          type="danger"
                          :disabled="intAddQty==0"
                          @click="intAddQty=0"
                          icon="close"
                        >Clear</a-button>
                      </v-col>
                      <v-col cols="6">
                        <a-button
                          block
                          :disabled="intAddQty==0"
                          icon="plus-circle"
                          type="primary"
                          @click="mAddMinusItem(1)"
                        >Add</a-button>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card color="#394989" class="mt-2 mr-2">
                  <v-card-title class="red--text">
                    <v-spacer></v-spacer>
                    <v-icon left color="red">mdi-minus-box-outline</v-icon>Deduct Quantity
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <v-card-text>
                    <a-form layout="vertical">
                      <a-form-item
                        class="mb-0"
                        labelAlign="left"
                        label="Input Quantity :"
                        style="width:100%"
                      >
                        <a-input-number
                          id="barcode"
                          :min="0"
                          style="width:100%"
                          v-model="intDeductQty"
                        />
                      </a-form-item>
                    </a-form>

                    <v-row justify="space-around">
                      <v-col cols="6">
                        <a-button
                          block
                          type="danger"
                          :disabled="intDeductQty==0"
                          @click="intDeductQty=0"
                          icon="close"
                        >Clear</a-button>
                      </v-col>
                      <v-col cols="6">
                        <a-button
                          block
                          :disabled="intDeductQty==0"
                          icon="minus-circle"
                          type="primary"
                          @click="mAddMinusItem(2)"
                        >Deduct</a-button>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="7">
                <v-card color="#394989" class="mt-2 ml-2">
                  <v-card-title>
                    <v-icon left>mdi-information-variant</v-icon>Item Information
                    <v-spacer></v-spacer>
                    <a-button v-if="blnEdit==false" @click="blnEdit=true" icon="edit">Edit</a-button>
                    <a-button
                      v-else
                      :disabled="mCheckEdit()"
                      key="submit"
                      icon="save"
                      type="primary"
                      @click="mUpdateItem()"
                    >Update</a-button>
                  </v-card-title>
                  <v-card-text>
                    <a-form layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                      <a-form-item
                        labelAlign="left"
                        label="Item Code"
                        :required="blnEdit"
                        style="width:100%"
                      >
                        <a-input :disabled="!blnEdit" v-model="stritemcode"></a-input>
                      </a-form-item>
                      <a-form-item
                        labelAlign="left"
                        label="Item Name"
                        :required="blnEdit"
                        style="width:100%"
                      >
                        <a-input :disabled="!blnEdit" v-model="stritemname"></a-input>
                      </a-form-item>
                      <a-form-item
                        labelAlign="left"
                        label="Actual Price"
                        :required="blnEdit"
                        style="width:100%"
                      >
                        <a-input-number
                          :disabled="!blnEdit"
                          :min="1"
                          style="width:100%"
                          v-model="intactualprice"
                        />
                      </a-form-item>
                      <a-form-item
                        labelAlign="left"
                        label="Price"
                        :required="blnEdit"
                        style="width:100%"
                      >
                        <a-input-number
                          :disabled="!blnEdit"
                          :min="1"
                          style="width:100%"
                          v-model="intprice"
                        />
                      </a-form-item>
                      <a-form-item
                        labelAlign="left"
                        label="Maximum Quantity"
                        :required="blnEdit"
                        style="width:100%"
                      >
                        <a-input-number
                          :disabled="!blnEdit"
                          :min="1"
                          style="width:100%"
                          v-model="intminimumQty"
                        />
                      </a-form-item>
                      <!-- <a-form-item
                    labelAlign="left"
                    label="Actual Quantity"
                    required
                    style="width:100%"
                  >
                    <a-input-number :min="1" style="width:100%" v-model="intactualQty" />
                      </a-form-item>-->
                      <a-form-item
                        labelAlign="left"
                        label="Unit"
                        :required="blnEdit"
                        style="width:100%"
                      >
                        <a-select :disabled="!blnEdit" v-model="intunitid" allowClear>
                          <a-select-option
                            v-for="i in objUnits"
                            :key="i.unitid"
                            :value="i.unitid"
                          >{{i.unitname}}</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item
                        labelAlign="left"
                        label="Supplier"
                        :required="blnEdit"
                        style="width:100%"
                      >
                        <a-select :disabled="!blnEdit" v-model="intsupplierId" allowClear>
                          <a-select-option
                            v-for="i in objSupplier"
                            :key="i.supplierId"
                            :value="i.supplierId"
                          >{{i.name}}</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item
                        labelAlign="left"
                        label="Expiry Date"
                        :required="blnEdit"
                        style="width:100%"
                      >
                        <a-date-picker
                          :disabled="!blnEdit"
                          v-model="dtexpiryDate"
                          style="width:100%"
                        />
                      </a-form-item>
                    </a-form>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <a-modal v-model="dialogEdit" centered title="Edit Item" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="dialogEdit=false">Cancel</a-button>
        <a-button
          :disabled="mCheckEdit()"
          key="submit"
          icon="save"
          type="primary"
          @click="mUpdateItem()"
        >Update</a-button>
      </template>
      <a-form layout="inline" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item labelAlign="left" label="Item Code" required style="width:100%">
          <a-input v-model="stritemcode"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Item Name" required style="width:100%">
          <a-input v-model="stritemname"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Actual Price" required style="width:100%">
          <a-input-number :min="1" style="width:100%" v-model="intactualprice" />
        </a-form-item>
        <a-form-item labelAlign="left" label="Price" required style="width:100%">
          <a-input-number :min="1" style="width:100%" v-model="intprice" />
        </a-form-item>
        <a-form-item labelAlign="left" label="Minimum Quantity" required style="width:100%">
          <a-input-number :min="1" style="width:100%" v-model="intminimumQty" />
        </a-form-item>
        <a-form-item labelAlign="left" label="Actual Quantity" required style="width:100%">
          <a-input-number :min="1" style="width:100%" v-model="intactualQty" />
        </a-form-item>
        <a-form-item labelAlign="left" label="Unit" required style="width:100%">
          <a-select v-model="intunitid" allowClear>
            <a-select-option v-for="i in objUnits" :key="i.unitid" :value="i.unitid">{{i.unitname}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item labelAlign="left" label="Supplier" required style="width:100%">
          <a-select v-model="intsupplierId" allowClear>
            <a-select-option
              v-for="i in objSupplier"
              :key="i.supplierId"
              :value="i.supplierId"
            >{{i.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item labelAlign="left" label="Expiry Date" required style="width:100%">
          <a-date-picker v-model="dtexpiryDate" style="width:100%" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="dialogAdd" centered title="Add New Item" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="dialogAdd=false">Cancel</a-button>
        <a-button
          :disabled="mCheckAdd()"
          key="submit"
          icon="save"
          type="primary"
          @click="mAddItem()"
        >Update</a-button>
      </template>
      <a-form layout="inline" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item labelAlign="left" label="Item Code" required style="width:100%">
          <a-input v-model="objNewItem.itemcode"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Item Name" required style="width:100%">
          <a-input v-model="objNewItem.itemname"></a-input>
        </a-form-item>
        <a-form-item labelAlign="left" label="Actual Price" required style="width:100%">
          <a-input-number :min="1" style="width:100%" v-model="objNewItem.actualprice" />
        </a-form-item>
        <a-form-item labelAlign="left" label="Price" required style="width:100%">
          <a-input-number :min="1" style="width:100%" v-model="objNewItem.price" />
        </a-form-item>
        <a-form-item labelAlign="left" label="Maximum Quantity" required style="width:100%">
          <a-input-number :min="1" style="width:100%" v-model="objNewItem.minimumQty" />
        </a-form-item>
        <a-form-item labelAlign="left" label="Actual Quantity" required style="width:100%">
          <a-input-number :min="1" style="width:100%" v-model="objNewItem.actualQty" />
        </a-form-item>
        <a-form-item labelAlign="left" label="Unit" required style="width:100%">
          <a-select v-model="objNewItem.unitid" allowClear>
            <a-select-option v-for="i in objUnits" :key="i.unitid" :value="i.unitid">{{i.unitname}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item labelAlign="left" label="Supplier" required style="width:100%">
          <a-select v-model="objNewItem.supplierId" allowClear>
            <a-select-option
              v-for="i in objSupplier"
              :key="i.supplierId"
              :value="i.supplierId"
            >{{i.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item labelAlign="left" label="Expiry Date" required style="width:100%">
          <a-date-picker v-model="objNewItem.expiryDate" style="width:100%" />
        </a-form-item>
      </a-form>
    </a-modal>

    <v-btn
      bottom
      color="green"
      v-if="cFilterItems.length!=0"
      dark
      fab
      fixed
      right
      @click="mAddNew()"
    >
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
      blnEdit: false,
      dialogAdd: false,
      isDelete: false,
      intpageCount: 0,
      intpage: 1,
      strFilterItem: "",
      strFilterUnit: "",
      stritemcode: "",
      stritemname: "",
      intAddQty: 0,
      intDeductQty: 0,
      intminimumQty: 0,
      intactualQty: 0,
      intactualprice: 0,
      intprice: 0,
      intunitid: 0,
      intsupplierId: 0,
      dtexpiryDate: null,
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
  computed: {
    cFilterItems() {
      let data = this.items;
      if (this.strFilterItem != undefined && this.strFilterItem != "") {
        data = data.filter(rec => {
          return (
            rec.itemcode.includes(this.strFilterItem) ||
            rec.itemname.includes(this.strFilterItem)
          );
        });
      }
      return data;
    },
    cPercentage() {
      // let value = this.intminimumQty * 2;
      return (this.intactualQty / this.intminimumQty) * 100;
    }
  },
  methods: {
    moment,
    mChangeSpace(el) {
      return el.replace(/ /gi, "");
    },
    mChangeSearch() {
      if (this.strFilterItem == "") {
        this.strFilterItem = undefined;
      }
      if (this.cFilterItems.length != 0) {
        this.mEdit(this.cFilterItems[0]);
      }
    },
    mGetData() {
      axios
        .get(this.url + `itemsMaster`)
        .then(res => {
          this.items = res.data;
          this.mEdit(this.items[0]);
          this.mChangeSearch();
        })
        .catch(err => {
          console.log(err);
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
      // this.dialogEdit = true;
      this.blnEdit = false;
      this.intAddQty = 0;
      this.intDeductQty = 0;
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

        // this.dialogEdit = false;
        this.blnEdit = false;
      });
    },
    mAddMinusItem(type) {
      this.objNewItem.type = type;
      this.objNewItem.AddQTY = this.intAddQty;
      this.objNewItem.DeductQTY = this.intDeductQty;

      axios.post(this.url + `AddMinusItems/`, this.objNewItem).then(res => {
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
        // this.dialogEdit = false;
        this.blnEdit = false;
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
<style>
#MyCard {
  max-height: calc(100vh - 120px);
  min-height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: auto;
}
#MyDiv2 {
  max-height: calc(100vh - 250px);
  min-height: calc(100vh - 250px);
  overflow-y: auto;
  overflow-x: auto;
}
#MyDiv2 .ant-list-item:hover {
  background-color: #eeeeea;
  cursor: pointer;
}
.v-application ul,
.v-application ol {
  padding-left: 0px;
}
</style> G