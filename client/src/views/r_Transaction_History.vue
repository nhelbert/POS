<template>
  <div>
    <v-data-table
      :headers="headers"
      :loading="isLoading"
      :items="mFilterTransaction()"
      item-key="invoiceNo"
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
              type="date"
              v-model="strFilterDate"
              label="Pay Date"
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              dense
              hide-details
              solo
              v-model="strFilterInvoiceNo"
              label="Search Invoice"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              dense
              hide-details
              solo
              v-model="strFilterCustomer"
              label="Search Customer"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              dense
              hide-details
              solo
              v-model="strFilterCashier"
              label="Search Cashier"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.invoiceNo="{ item }">
        <span v-if="strFilterInvoiceNo">
          <template
            v-for="(fragment, i) in item.invoiceNo.toString().split(new RegExp(`(?<=${strFilterInvoiceNo})|(?=${strFilterInvoiceNo})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterInvoiceNo.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.invoiceNo}}</template>
      </template>
      <template v-slot:item.dateEntry="{ item }">
        <h5>{{moment(item.dateEntry).format("L LT")}}</h5>
      </template>
      <template v-slot:item.totalPurchase="{ item }">
        <h5>₱ {{item.totalPurchase}}</h5>
      </template>
      <template v-slot:item.recievedcash="{ item }">
        <h5>₱ {{item.totalPurchase}}</h5>
      </template>
      <template v-slot:item.change="{ item }">
        <h5>₱ {{item.change}}</h5>
      </template>
      <template v-slot:item.Fullname="{ item }">
        <span v-if="strFilterCustomer">
          <template
            v-for="(fragment, i) in item.Fullname.toString().split(new RegExp(`(?<=${strFilterCustomer})|(?=${strFilterCustomer})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterCustomer.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.Fullname}}</template>
      </template>
      <template v-slot:item.userId="{ item }">
        <span v-if="strFilterCashier">
          <template
            v-for="(fragment, i) in mGetUserName(item).toString().split(new RegExp(`(?<=${strFilterCashier})|(?=${strFilterCashier})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterCashier.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{mGetUserName(item)}}</template>
      </template>
      <template v-slot:item.action="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon color="black" v-on="on" @click="mView(item)">mdi-paper-roll</v-icon>
          </template>
          <span>Print Reciept</span>
        </v-tooltip>
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

    <v-dialog v-model="isDialogReciept" max-width="400">
      <v-col align="center" id="card">
        <v-row align="center">
          <v-col cols="6">
            <v-btn color="error" block @click="mPrint(false)">
              <v-icon>mdi-cancel</v-icon>Don't Print
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block color="primary" @click="mPrint(true)">
              <v-icon>mdi-printer</v-icon>Print
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col align="center">
        <v-container id="card">
          <div id="printMe">
            <br />
            <div style="text-align:center;font-size:15px;font-weight: bold">PAOER Groceries</div>
            <div style="text-align:center;font-size:12px">Cadiz City, Negros Occidental</div>
            <div style="text-align:center;font-size:12px">Tel: 123-4567-890</div>
            <br />
            <div style="text-align:left;font-size:12px">Invoice No. : {{printobj.invoiceNo}}</div>
            <div style="text-align:left;font-size:12px">Cashier : {{mGetUserName(printobj)}}</div>
            <div
              style="text-align:left;font-size:12px"
            >Date : {{moment(printobj.dateEntry).format("L LT")}}</div>

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
              >₱{{printobj.totalPurchase}}</div>
            </div>
            <div style="display: flex;">
              <div style="width:50%;font-size:12px;margin-left:15px">CASH</div>
              <div style="width:50%;text-align:right;font-size:15px">₱{{printobj.recievedcash}}</div>
            </div>
            <div style="display: flex;">
              <div style="width:50%;font-size:12px;font-weight: bold">CHANGE</div>
              <div
                style="width:50%;text-align:right;font-size:15px;font-weight: bold"
              >₱{{printobj.change}}</div>
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
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      isLoading: true,
      printobj: [],
      intpageCount: 0,
      intpage: 1,
      strFilterInvoiceNo: "",
      strFilterDate: "",
      strFilterCustomer: "",
      strFilterCashier: "",
      DateNow: new Date(),
      isDialogReciept: false,
      sale_transaction: [],
      sales_product: [],
      items: [],
      objUnits: [],
      headers: [
        {
          text: "Invoice No.",
          align: "center",
          value: "invoiceNo"
        },
        {
          text: "Pay Date",
          align: "center",
          value: "dateEntry"
        },
        {
          text: "Total Price",
          align: "center",
          value: "totalPurchase"
        },
        {
          text: "Cash",
          align: "center",
          value: "recievedcash"
        },
        {
          text: "Change",
          align: "center",
          value: "change"
        },
        {
          text: "Casher",
          align: "center",
          value: "userId"
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
  computed: {
    cTotalProduct: function() {
      if (this.sales_product != undefined) {
        return this.sales_product.length;
      } else {
        return "";
      }
    }
  },
  methods: {
    moment,
    mGetData() {
      axios.get(this.url + `items`).then(res => {
        this.items = res.data;
      });
      axios.get(this.url + `units`).then(res => {
        this.objUnits = res.data;
      });
      axios.get(this.url + `sale_transaction_history`).then(res => {
        this.sale_transaction = res.data;
        this.strFilterDate = res.data[0].dateEntry;
        this.strFilterDate = moment(this.strFilterDate).format("YYYY-MM-DD");
      });

      this.isLoading = false;
    },
    mFilterTransaction() {
      return this.sale_transaction.filter(data => {
        return (
          data.invoiceNo.includes(this.strFilterInvoiceNo) &&
          data.Fullname.toUpperCase().includes(
            this.strFilterCustomer.toUpperCase()
          ) &&
          data.dateEntry.includes(
            this.strFilterDate == ""
              ? ""
              : moment(this.strFilterDate).format("YYYY-MM-DD")
          ) &&
          (data.Fname.toUpperCase().includes(
            this.strFilterCashier.toUpperCase()
          ) ||
            data.Mname.toUpperCase().includes(
              this.strFilterCashier.toUpperCase()
            ) ||
            data.Lname.toUpperCase().includes(
              this.strFilterCashier.toUpperCase()
            ))
        );
      });
    },
    mGetUserName(item) {
      if (item != undefined) {
        return item.Fname + " " + item.Mname + " " + item.Lname;
      } else {
        return "";
      }
    },
    mgetItemIndex(itemcode) {
      let index = this.items.find(item => item.itemcode == itemcode);
      return this.items.indexOf(index);
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
      return this.items[this.mgetItemIndex(itemcode)].price;
    },
    mgetAmount(item) {
      let price = this.mgetPrice(item);
      let qty = item.qty;
      return parseFloat(price) * parseFloat(qty);
    },
    mView(item) {
      this.printobj = item;
      this.isDialogReciept = true;
      axios
        .get(this.url + `sale_product_history/` + item.invoiceNo)
        .then(res => {
          this.sales_product = res.data;
        });
    },
    mPrint(flag) {
      if (flag) {
        this.$htmlToPaper("printMe");
      }
      this.isDialogReciept = !this.isDialogReciept;
    }
  }
};
</script>