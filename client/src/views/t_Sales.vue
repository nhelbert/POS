<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col md="4" sm="12" align="center">
        <v-card id="transparent" class="ma-5">
          <v-card-text>
            <v-autocomplete
              dense
              solo
              single-line
              hide-details
              v-model="strBarcode"
              :items="items"
              v-on:keyup.enter="maddItem"
              item-text="itemname"
              item-value="itemcode"
            >
              <template v-slot:selection="{ item }">
                <h5>Item: {{item.itemname}} || Unit:{{mgetUnit(item)}} || Price: ₱ {{item.price}}</h5>
              </template>
              <template v-slot:item="{ item }">
                <h5>Item: {{item.itemname}} || Unit:{{mgetUnit(item)}} || Price: ₱ {{item.price}}</h5>
              </template>
            </v-autocomplete>
            <!-- <a-select show-search style="width: 100%">
              <a-select-option v-for="item in items" :key="item.itemcode">
                <h5>Item: {{item.itemname}} || Unit:{{mgetUnit(item)}} || Price: ₱ {{item.price}}</h5>
              </a-select-option>
            </a-select>-->
            <!-- <a-input
              class="mt-2"
              id="barcode"
              ref="strBarcode"
              v-model="strBarcode"
              autofocus
              placeholder="Scan Barcode"
              @keyup.enter="maddItem"
            />-->

            <v-text-field
              class="mt-2"
              id="barcode"
              ref="strBarcode"
              dense
              solo
              hide-details
              autofocus
              v-model="strBarcode"
              single-line
              placeholder="Scan Barcode"
              @keyup.enter="maddItem"
              autocomplete="off"
            ></v-text-field>

            <v-img
              class="mt-2"
              style="border:1px solid black;width:100%;"
              position="center"
              src="../assets/Images/barcode.png"
              contain
            ></v-img>
          </v-card-text>
          <v-card-actions>
            <v-col class="pa-0" align="center">
              <a-button
                class="mx-1"
                icon="credit-card"
                :disabled="cTotalPrice==0"
                @click="mOk()"
                type="primary"
              >Pay</a-button>
              <a-button
                class="mx-1"
                icon="delete"
                :disabled="cTotalPrice==0"
                @click="mclearItem()"
                type="danger"
              >Clear</a-button>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col md="8" sm="12" align="center">
        <v-data-table
          :headers="tHeader"
          :items="sales_product"
          class="transparent ma-5"
          :page.sync="intpage"
          hide-default-footer
          @page-count="intpageCount = $event"
        >
          <template v-slot:top>
            <h3 class="text-center">Scanned Item</h3>
          </template>
          <template v-slot:item.qty="{item}">
            <v-icon
              :color="item.qty<=1 ? 'grey':'red'"
              :disabled="item.qty<=1"
              @click="mminusItemQty(item)"
            >mdi-minus-box-outline</v-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on" class="mx-1" @click="mEditQty(item)">{{item.qty}}</span>
              </template>
              <span>Click to change quantity.</span>
            </v-tooltip>

            <v-icon color="blue" @click="maddItemQty(item)">mdi-plus-box-outline</v-icon>
          </template>
          <template v-slot:item.unit="{item}" style="border:0">{{mgetUnit(item)}}</template>
          <template v-slot:item.itemname="{item}">{{mgetItemName(item)}}</template>
          <template v-slot:item.price="{item}">₱ {{mgetPrice(item)}}</template>
          <template v-slot:item.amount="{item}">₱ {{mgetAmount(item)}}</template>

          <template v-slot:item.action="{item}">
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
          </template>

          <template v-slot:footer>
            <v-row v-if="cTotalPrice!=0" justify="space-around">
              <v-col align="center" cols="auto">
                <h4>Items Purchased : {{cTotalProduct}}</h4>
              </v-col>
              <v-col align="center" cols="auto">
                <h4>Total Price : ₱ {{cTotalPrice}}</h4>
              </v-col>
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
      </v-col>
    </v-row>

    <v-dialog v-model="isEditQty" persistent max-width="350">
      <v-card>
        <v-card-title class="text-center">Input Quantity</v-card-title>
        <v-card-text>
          <a-input-number
            id="barcode"
            size="large"
            :min="1"
            style="width:100%;text-align:right"
            v-model="objItemQty.qty"
            @pressEnter="mChangeQty()"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isDialog" persistent max-width="350">
      <v-col id="card" align="center">
        <v-img
          height="50"
          position="center center"
          transition="scroll-y-reverse-transition"
          contain
          lazy-src="../assets/Images/title.png"
          src="../assets/Images/title.png"
        ></v-img>
      </v-col>
      <!-- <a-statistic title="Account Balance (CNY)" :precision="2" :value="112893" /> -->
      <v-col align="center">
        <v-container id="card">
          <v-row no-gutters justify="center">
            <v-col cols="12">
              <a-statistic title="Total Price" :precision="2" v-model="cTotalPrice">
                <template #prefix>₱</template>
              </a-statistic>
            </v-col>
            <a-divider>Input Cash</a-divider>
            <v-col cols="12">
              <a-input-number
                :formatter="value => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                id="barcode"
                size="large"
                :min="1"
                style="width:100%;text-align:right"
                v-model="intCash"
                @pressEnter="mSubmit()"
              />
            </v-col>
            <v-col cols="12">
              <v-chip-group
                center-active
                show-arrows
                active-class="primary--text"
                v-model="intCash"
                class="pa-0"
              >
                <v-chip small v-for="value in cChipcash" :key="value" :value="value">{{ value }}</v-chip>
              </v-chip-group>
            </v-col>
            <a-divider></a-divider>
            <v-col v-if="intCash!=0 && intCash!=undifined" cols="12">
              <a-statistic title="Change" :precision="2" v-model="cChange">
                <template #prefix>₱</template>
              </a-statistic>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <a-button block icon="redo" @click="isDialog =!isDialog" type="danger">Cancel</a-button>
            </v-col>
            <v-col cols="6">
              <a-button
                block
                icon="credit-card"
                :disabled="cTotalPrice>intCash"
                @click="mSubmit()"
                type="primary"
              >Pay</a-button>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-dialog>

    <v-dialog v-model="isDialogReciept" max-width="400">
      <v-col align="center" id="card">
        <v-row align="center">
          <v-col cols="6">
            <a-button block icon="close" @click="mPrint(false)" type="danger">Don't Print</a-button>
          </v-col>
          <v-col cols="6">
            <a-button block icon="printer" @click="mPrint(true)" type="primary">Print</a-button>
          </v-col>
        </v-row>
      </v-col>
      <v-col align="center">
        <v-container id="card" style="background-color:white">
          <div id="printMe">
            <br />
            <div style="text-align:center;font-size:15px;font-weight: bold">PAOER Groceries</div>
            <div style="text-align:center;font-size:12px">Cadiz City, Negros Occidental</div>
            <div style="text-align:center;font-size:12px">Tel: 123-4567-890</div>
            <br />
            <div style="text-align:left;font-size:12px">Invoice No. : {{sale_transaction.invoiceNo}}</div>
            <div style="text-align:left;font-size:12px">Cashier : {{username}}</div>
            <div style="text-align:left;font-size:12px">Date : {{sale_transaction.dateEntry}}</div>

            <div style="width:100%;text-align:left;border-top: 1px dashed black"></div>

            <v-simple-table class="transparent" fixed-header dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th style="width:5%;background-color:transparent">Qty</th>
                    <th style="width:5%;background-color:transparent">Unit</th>
                    <th style="width:50%;background-color:transparent">Item</th>
                    <th style="width:5%;background-color:transparent">Price</th>
                    <th style="width:5%;background-color:transparent">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in sales_product" :key="item.code">
                    <td style="border:0;text-align:center">{{item.qty}}</td>
                    <td style="border:0">{{mgetUnit(item)}}</td>
                    <td style="border:0">{{mgetItemName(item)}}</td>
                    <td style="border:0;text-align:center">{{mgetPrice(item)}}</td>
                    <td style="border:0;text-align:center">{{mgetAmount(item)}}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div style="display: flex;">
              <div style="width:50%;text-align:left;border-top: 1px dashed black;margin-top:10px"></div>
              <div style="width:50%;text-align:center">{{cTotalProduct}} Item(s)</div>
              <div style="width:50%;text-align:right;border-top: 1px dashed black;margin-top:10px"></div>
            </div>
            <div style="display: flex;">
              <div style="width:50%;font-size:12px;font-weight: bold">TOTAL</div>
              <div
                style="width:50%;text-align:right;font-size:15px;font-weight: bold"
              >₱{{cTotalPrice}}</div>
            </div>
            <div style="display: flex;">
              <div style="width:50%;font-size:12px;margin-left:15px">CASH</div>
              <div style="width:50%;text-align:right;font-size:15px">₱{{intCash}}</div>
            </div>
            <div style="display: flex;">
              <div style="width:50%;font-size:12px;font-weight: bold">CHANGE</div>
              <div style="width:50%;text-align:right;font-size:15px;font-weight: bold">₱{{cChange}}</div>
            </div>
            <div
              style="text-align:center;font-size:12px;border-top: 1px dashed black;"
            >Programmers Project</div>
            <div style="text-align:center;font-size:10px">SMD Software Development</div>
            <div style="text-align:center;font-size:10px">Tel: 123-4567-8901</div>
            <div
              style="text-align:center;font-size:11px;border-top: 1px dashed black"
            >THIS INVOICE/RECIEPT SHALL BE</div>
            <div style="text-align:center;font-size:11px">VALID FOR FIVE(5) YEARS FROM</div>
            <div style="text-align:center;font-size:11px">THE DATE OF THE PERMIT TO USE.</div>
            <div style="text-align:center;font-size:11px">Thank you, Come again!</div>
          </div>
        </v-container>
      </v-col>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  components: {},
  data: () => {
    return {
      DateNow: "",
      isDialog: false,
      isDialogReciept: false,
      isEditQty: false,
      isDelete: false,
      intpageCount: 0,
      intpage: 1,
      objItem: [],
      strBarcode: "",
      intCash: "",
      userId: "",
      usertype: "",
      username: "",
      useravatar: "",
      strItemsSearch: "",
      sales_product: [],
      objUnits: [],
      objItemQty: {},
      sale_transaction: {},
      items: [],
      tHeader: [
        {
          text: "Qty",
          align: "center",
          sortable: false,
          value: "qty"
        },
        {
          text: "Item",
          align: "left",
          sortable: false,
          value: "itemname"
        },
        {
          text: "Unit",
          align: "center",
          sortable: false,
          value: "unit"
        },
        {
          text: "Price",
          align: "center",
          sortable: false,
          value: "price"
        },
        {
          text: "Amount",
          align: "center",
          sortable: false,
          value: "amount"
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
  computed: {
    cChipcash() {
      let data = [];
      let mult = this.cTotalPrice.toString().length - 1;
      mult = mult == 0 ? 1 : mult;
      let zero = "0";
      for (let i = 1; i < mult; i++) {
        zero = zero + "0";
      }

      if (mult != 0) {
        for (let a = 1; a < 11; a++) {
          let aa = a.toString() + zero;
          data.push(parseFloat(aa));
        }
      }
      data.push(this.cTotalPrice);
      data.reverse();
      return data;
    },
    cTotalPrice: function() {
      let sum = 0;
      for (let i = 0; i < this.sales_product.length; i++) {
        sum += parseFloat(this.mgetAmount(this.sales_product[i]));
      }
      return sum;
    },
    cTotalProduct: function() {
      return this.sales_product.length;
    },
    cChange: function() {
      return this.intCash - this.cTotalPrice;
    }
  },
  created() {
    this.sales_product = this.sSales_product;
    this.mgetData();
    setInterval(this.mGetDateNow, 1000);
  },
  methods: {
    moment,
    mrevsales_product() {
      this.sales_product.reverse();
    },
    mGetDateNow() {
      if (this.$route.path == "/sales") {
        this.DateNow = new Date();
        if (this.$refs.strBarcode != undefined) {
          if (this.$refs.strBarcode.isFocused == false) {
            this.$refs.strBarcode.focus();
          }
        }
      }
    },
    mgetData() {
      axios.get(this.url + `items`).then(res => {
        this.items = res.data;
      });
      axios.get(this.url + `units`).then(res => {
        this.objUnits = res.data;
      });
    },
    mPrint(flag) {
      if (flag) {
        this.$htmlToPaper("printMe");
      }
      this.isDialogReciept = !this.isDialogReciept;
      this.mclearItem();
    },
    mSubmit() {
      if (this.cTotalPrice <= this.intCash) {
        this.sale_transaction.invoiceNo = moment(this.DateNow).format(
          "YYYYMMDDhhmmss"
        );
        this.sale_transaction.dateEntry = moment(this.DateNow).format("L LT");
        this.sale_transaction.recievedcash = this.intCash;
        this.sale_transaction.totalPurchase = this.cTotalPrice;
        this.sale_transaction.change = this.cChange;
        this.sale_transaction.userId = this.sUserData[0].ID;
        for (let i in this.sales_product) {
          this.sales_product[i].invoiceNo = this.sale_transaction.invoiceNo;
        }

        axios
          .post(this.url + `sale_transaction/`, this.sale_transaction)
          .then(res => {
            if (res.data.invoiceNo == this.sale_transaction.invoiceNo) {
              axios
                .post(this.url + `sale_product/`, this.sales_product)
                .then(res => {
                  if (
                    res.data[0].invoiceNo == this.sale_transaction.invoiceNo
                  ) {
                    axios
                      .post(
                        this.url +
                          `updateitemqty/` +
                          this.sale_transaction.invoiceNo
                      )
                      .then(res => {
                        if (this.sale_transaction.invoiceNo == res.data) {
                          this.$notification.success({
                            message: this.gSystemTitle,
                            description: "Successfully Submit."
                          });
                          this.isDialogReciept = true;
                          this.isDialog = !this.isDialog;
                        } else {
                          this.$notification.error({
                            message: this.gSystemTitle,
                            description:
                              "Error in deducting item qty.Please update item actual qty."
                          });
                          this.isDialogReciept = true;
                          this.isDialog = !this.isDialog;
                        }
                      });
                  } else {
                    this.$notification.error({
                      message: this.gSystemTitle,
                      description: "Error in Sumbit.Please try again."
                    });
                  }
                });
            } else {
              this.$notification.error({
                message: this.gSystemTitle,
                description: "Error in Sumbit.Please try again."
              });
            }
          });
      } else {
        this.$notification.error({
          message: this.gSystemTitle,
          description: "Insufficient cash."
        });
      }
    },
    mOk() {
      this.isDialog = !this.isDialog;
      this.intCash = "";
    },
    mChangeQty() {
      if (this.objItemQty.qty != 0 && this.objItemQty.qty != null) {
        this.objItemQty.qty = parseFloat(this.objItemQty.qty);
        this.$store.commit("cSales_product", this.sales_product);
        this.isEditQty = false;
      }
    },
    mEditQty(item) {
      this.objItemQty = item;
      this.isEditQty = true;
    },
    mclearItem() {
      this.sales_product = [];
      this.strBarcode = "";
      this.$store.commit("cSales_product", this.sales_product);
    },
    mminusItemQty(item) {
      item.qty -= parseFloat("1");
      this.$store.commit("cSales_product", this.sales_product);
    },
    maddItemQty(item) {
      item.qty += parseFloat("1");
      this.$store.commit("cSales_product", this.sales_product);
    },
    maddItem() {
      if (this.strBarcode != "" && this.strBarcode != undefined) {
        if (this.mgetItemCode()) {
          if (this.mgetSale_ProductIndex(this.strBarcode) < 0) {
            this.sales_product.push({ itemcode: this.strBarcode, qty: 1 });
          } else {
            this.sales_product[
              this.mgetSale_ProductIndex(this.strBarcode)
            ].qty += parseFloat("1");
          }
        } else {
          this.$notification.error({
            message: this.gSystemTitle,
            description: "Not registered in items !"
          });
        }
      }
      this.strItemsSearch = "";

      this.$store.commit("cSales_product", this.sales_product);
      this.strBarcode = "";
    },
    mgetItemIndex(itemcode) {
      let index = this.items.find(item => item.itemcode == itemcode);
      return this.items.indexOf(index);
    },
    mgetSale_ProductIndex(itemcode) {
      let index = this.sales_product.find(item => item.itemcode == itemcode);
      return this.sales_product.indexOf(index);
    },
    mgetItemCode() {
      if (this.mgetItemIndex(this.strBarcode) < 0) {
        return false;
      } else {
        return true;
      }
    },
    mgetUnit(item) {
      if (item.length != 0) {
        let itemcode = item.itemcode;
        let unitID = this.items[this.mgetItemIndex(itemcode)].unitid;
        let unitName = this.objUnits.find(rec => rec.unitid == unitID);
        if (unitName != undefined) {
          return unitName.unitname;
        } else return "";
      } else {
        return "";
      }
    },
    mgetItemName(item) {
      let itemcode = item.itemcode;
      return this.items[this.mgetItemIndex(itemcode)].itemname;
    },
    mgetPrice(item) {
      let itemcode = item.itemcode;
      if (this.items[this.mgetItemIndex(itemcode)].price != undefined) {
        return this.items[this.mgetItemIndex(itemcode)].price;
      } else {
        return 0;
      }
    },
    mgetAmount(item) {
      let price = this.mgetPrice(item);
      let qty = item.qty;
      if (price != undefined) {
        return parseFloat(price) * parseFloat(qty);
      } else {
        return 0;
      }
    },
    mdeleteitem() {
      this.isDelete = false;
      this.sales_product.splice(
        this.mgetSale_ProductIndex(this.objItem.itemcode),
        1
      );
      this.$store.commit("cSales_product", this.sales_product);
    },
    mSelectitem(item) {
      this.isDelete = true;
      this.objItem = item;
    }
  }
};
</script>
