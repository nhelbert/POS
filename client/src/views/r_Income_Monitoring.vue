<template>
  <div>
    <v-menu bottom :close-on-content-click="false" offset-y transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn style="color:blue" v-on="on" fab text fixed small right>
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          Bar Settings
          <v-switch class="ma-0 pa-0" v-model="cshow" hide-details label="Show"></v-switch>
        </v-card-title>
        <v-card-text>
          <v-row justify="space-around">
            <v-switch
              class="ma-0 pa-0"
              :disabled="!sBlnGraph"
              v-model="fill"
              hide-details
              label="Filled"
            ></v-switch>
            <v-switch
              class="ma-0 pa-0"
              :disabled="!sBlnGraph"
              v-model="showlabel"
              hide-details
              label="Show Label"
            ></v-switch>
          </v-row>

          <v-divider class="mt-2"></v-divider>

          <v-item-group class="mt-2" v-model="gradient" mandatory>
            <v-row no-gutters justify="space-around">
              <v-item
                v-for="(gradient, i) in gradients"
                :key="i"
                v-slot:default="{ active, toggle }"
                :value="gradient"
              >
                <v-card
                  :disabled="!sBlnGraph"
                  :style="{
                    background: gradient.length > 1
                      ? `linear-gradient(0deg, ${gradient})`
                      : gradient[0],
                    border: '2px solid',
                    borderColor: active ? '#222' : 'white'
                  }"
                  width="30"
                  height="30"
                  F
                  @click.native="toggle"
                ></v-card>
              </v-item>
            </v-row>
          </v-item-group>
          <v-divider class="mt-2"></v-divider>
          <v-slider
            :disabled="!sBlnGraph"
            v-model="width"
            hide-details
            label="Width"
            min="0.1"
            max="10"
            thumb-label
          ></v-slider>
          <v-slider
            :disabled="!sBlnGraph"
            v-model="radius"
            hide-details
            label="Radius"
            min="0"
            max="25"
            thumb-label
          ></v-slider>
          <v-slider
            :disabled="!sBlnGraph"
            v-model="padding"
            hide-details
            label="Padding"
            min="0"
            max="25"
            thumb-label
          ></v-slider>
        </v-card-text>
      </v-card>
    </v-menu>

    <v-sparkline
      v-show="sBlnGraph"
      :fill="fill"
      :gradient="gradient"
      :line-width="width"
      :padding="padding"
      :smooth="radius || false"
      :value="cbarvalue"
      label-size="3"
      :show-labels="showlabel"
      auto-draw
    >
      <template v-if="showlabel" v-slot:label="item">₱ {{ item.value }}</template>
    </v-sparkline>

    <v-row v-if="mFilterTransaction()!=0" justify="space-around">
      <v-col align="center" cols="auto">
        <h4>Total Amount : {{mGetGrandTotalAmount()}}</h4>
      </v-col>
      <v-col align="center" cols="auto">
        <h4>Total Gross : ₱ {{mGetGrandTotalGross()}}</h4>
      </v-col>
      <v-col align="center" cols="auto">
        <h4>Total Net : ₱ {{mGetGrandTotalNet()}}</h4>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :loading="isLoading"
      :items="mFilterTransaction()"
      item-key="invoiceNo"
      class="transparent"
      :page.sync="intpage"
      hide-default-footer
      @page-count="intpageCount = $event"
      show-expand
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
              label="Date From"
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              dense
              hide-details
              solo
              type="date"
              v-model="strFilterDateto"
              label="Date To"
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
      <template v-slot:item.dateEntry="{ item }">{{moment(item.dateEntry).format("L LT")}}</template>
      <template v-slot:item.totalamount="{ item }">₱ {{mGetTotalAmount(item)}}</template>
      <template v-slot:item.totalgross="{ item }">₱ {{mGetTotalGross(item)}}</template>
      <template v-slot:item.totalnet="{ item }">₱ {{mGetTotalNet(item)}}</template>
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
      <template v-slot:expanded-item="{ headers, item }">
        <td class="pa-1" :colspan="headers.length">
          <v-data-table
            :headers="tHeader"
            :items="mGetItem(item)"
            class="transparent ma-2"
            :page.sync="intpageT"
            hide-default-footer
            @page-count="intpageCountT = $event"
          >
            <template v-slot:item.unit="{item}" style="border:0">{{mgetUnit(item)}}</template>
            <template v-slot:item.itemname="{item}">{{mgetItemName(item)}}</template>
            <template v-slot:item.price="{item}">₱ {{mgetPrice(item)}}</template>
            <template v-slot:item.amount="{item}">₱ {{mgetAmount(item)}}</template>
            <template v-slot:item.gross="{item}">₱ {{mgetGross(item)}}</template>
            <template v-slot:item.net="{item}">₱ {{mgetNet(item)}}</template>

            <template v-slot:footer>
              <v-row justify="space-around">
                <v-col align="center" cols="auto" class="pa-0">
                  <v-pagination
                    v-model="intpageT"
                    :length="intpageCountT"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                  ></v-pagination>
                </v-col>
              </v-row>
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"]
];
export default {
  data() {
    return {
      isLoading: true,
      intpageCount: 0,
      intpage: 1,
      intpageCountT: 0,
      intpageT: 1,
      strFilterInvoiceNo: "",
      strFilterDate: "",
      strFilterDateto: "",
      strFilterCustomer: "",
      strFilterCashier: "",
      sale_transaction: [],
      sales_product: [],
      items: [],
      objUnits: [],
      objsale_product: [],
      headers: [
        {
          text: "Invoice No.",
          align: "center",
          value: "invoiceNo"
        },
        {
          text: "Date",
          align: "center",
          value: "dateEntry"
        },
        {
          text: "Total Amount",
          align: "center",
          value: "totalamount"
        },
        {
          text: "Total Gross",
          align: "center",
          value: "totalgross"
        },
        {
          text: "Total Net",
          align: "center",
          value: "totalnet"
        },
        {
          text: "Customer",
          align: "center",
          value: "Fullname"
        },
        {
          text: "Casher",
          align: "center",
          value: "userId"
        },
        { text: "", align: "center", value: "data-table-expand" }
      ],
      tHeader: [
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
          text: "Qty",
          align: "center",
          sortable: false,
          value: "qty"
        },
        {
          text: "Amount",
          align: "center",
          sortable: false,
          value: "amount"
        },
        {
          text: "Gross",
          align: "center",
          sortable: false,
          value: "gross"
        },
        {
          text: "Net",
          align: "center",
          sortable: false,
          value: "net"
        }
      ],
      showlabel: true,
      fill: true,
      gradient: gradients[5],
      gradients,
      padding: 25,
      radius: 10,
      width: 0
    };
  },
  created() {
    this.mGetData();
  },
  computed: {
    cbarvalue: function() {
      if (this.mFilterTransaction().length != 0) {
        let value = this.mFilterTransaction().map(x => this.mGetTotalNet(x));
        value.push(0);
        value.reverse();
        return value;
      } else {
        let value = [];
        value.push(0);
        return value;
      }
    },
    cshow: {
      set(value) {
        this.$store.commit("cBlnGraph", value);
      },
      get() {
        return this.sBlnGraph;
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
      axios.get(this.url + `sale_product`).then(res => {
        this.objsale_product = res.data;
      });
      axios.get(this.url + `sale_transaction_history`).then(res => {
        this.sale_transaction = res.data;
        this.strFilterDate = res.data[0].dateEntry;
        this.strFilterDate = moment(this.strFilterDate).format("YYYY-MM-DD");
        this.strFilterDateto = moment(this.strFilterDate).format("YYYY-MM-DD");
      });

      this.isLoading = false;
    },
    mFilterTransaction() {
      let start =
        this.strFilterDate == ""
          ? moment("2000/01/01").format("YYYY-MM-DD")
          : moment(this.strFilterDate).format("YYYY-MM-DD");
      let end = this.strFilterDateto
        ? moment("2050/01/01").format("YYYY-MM-DD")
        : moment(this.strFilterDate).format("YYYY-MM-DD");

      return this.sale_transaction.filter(data => {
        return (
          data.invoiceNo.includes(this.strFilterInvoiceNo) &&
          data.Fullname.toUpperCase().includes(
            this.strFilterCustomer.toUpperCase()
          ) &&
          (data.Fname.toUpperCase().includes(
            this.strFilterCashier.toUpperCase()
          ) ||
            data.Mname.toUpperCase().includes(
              this.strFilterCashier.toUpperCase()
            ) ||
            data.Lname.toUpperCase().includes(
              this.strFilterCashier.toUpperCase()
            )) &&
          moment(data.dateEntry).format("YYYY-MM-DD") >= start &&
          moment(data.dateEntry).format("YYYY-MM-DD") <= end
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
      let itemName = this.items[this.mgetItemIndex(itemcode)].itemname;
      if (itemName != undefined) {
        return itemName;
      } else return "";
    },
    mgetPrice(item) {
      let itemcode = item.itemcode;
      let price = this.items[this.mgetItemIndex(itemcode)].price;
      if (price != undefined) {
        return price;
      } else return 0;
    },
    mgetActualPrice(item) {
      let itemcode = item.itemcode;
      let actualprice = this.items[this.mgetItemIndex(itemcode)].actualprice;
      if (actualprice != undefined) {
        return actualprice;
      } else return 0;
    },
    mgetItemNet(item) {
      let itemcode = item.itemcode;
      let actualprice = this.items[this.mgetItemIndex(itemcode)].actualprice;
      let price = this.items[this.mgetItemIndex(itemcode)].price;
      if (actualprice == undefined) {
        actualprice = 0;
      }
      if (price == undefined) {
        price = 0;
      }
      return parseFloat(price) - parseFloat(actualprice);
    },
    mgetAmount(item) {
      let price = this.mgetPrice(item);
      let qty = item.qty;
      if (qty == undefined) {
        qty = 0;
      }
      return parseFloat(price) * parseFloat(qty);
    },
    mgetGross(item) {
      let price = this.mgetActualPrice(item);
      let qty = item.qty;
      return parseFloat(price) * parseFloat(qty);
    },
    mgetNet(item) {
      let price = this.mgetItemNet(item);
      let qty = item.qty;
      return parseFloat(price) * parseFloat(qty);
    },
    mGetTotalAmount(item) {
      let sum = 0;
      for (let i = 0; i < this.mGetItem(item).length; i++) {
        sum += parseFloat(this.mgetAmount(this.mGetItem(item)[i]));
      }
      return sum;
    },
    mGetTotalGross(item) {
      let sum = 0;
      for (let i = 0; i < this.mGetItem(item).length; i++) {
        sum += parseFloat(this.mgetGross(this.mGetItem(item)[i]));
      }
      return sum;
    },
    mGetTotalNet(item) {
      let sum = 0;
      for (let i = 0; i < this.mGetItem(item).length; i++) {
        sum += parseFloat(this.mgetNet(this.mGetItem(item)[i]));
      }
      return sum;
    },
    mGetGrandTotalAmount() {
      let sum = 0;
      for (let i = 0; i < this.mFilterTransaction().length; i++) {
        sum += parseFloat(this.mGetTotalAmount(this.mFilterTransaction()[i]));
      }
      return sum;
    },
    mGetGrandTotalGross() {
      let sum = 0;
      for (let i = 0; i < this.mFilterTransaction().length; i++) {
        sum += parseFloat(this.mGetTotalGross(this.mFilterTransaction()[i]));
      }
      return sum;
    },
    mGetGrandTotalNet() {
      let sum = 0;
      for (let i = 0; i < this.mFilterTransaction().length; i++) {
        sum += parseFloat(this.mGetTotalNet(this.mFilterTransaction()[i]));
      }
      return sum;
    },
    mGetItem(item) {
      let expanditem = item;
      return this.objsale_product.filter(data => {
        return data.invoiceNo.includes(expanditem.invoiceNo);
      });
    }
  }
};
</script>