<template>
  <div>
    <template>
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            dense
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            outlined
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :search="search"
            :items="itemData"
            item-key="name"
            class="myTable"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script>
// import Product from "./t_Products.vue";
import axios from "axios";
export default {
  components: {
    // Product
  },
  data() {
    return {
      search: "",
      itemData: [],
      headers: [
        {
          text: "Item Code",
          align: "center",
          sortable: false,
          value: "itemcode",
          class: "test"
        },
        {
          text: "Item Name",
          align: "center",
          value: "itemname"
        },
        {
          text: "Minimum Qty",
          align: "center",
          value: "minimumQty"
        },
        {
          text: "Actual Qty",
          align: "center",
          value: "actualQty"
        },
        {
          text: "Unit",
          align: "center",
          value: "unitname"
        },
        {
          text: "Actual Price",
          align: "center",
          value: "acutalprice"
        },
        {
          text: "Price",
          align: "center",
          value: "price"
        },
        {
          text: "Supplier Name",
          align: "center",
          value: "supplier"
        }
      ]
    };
  },
  created() {
    this.getItems();
  },
  methods: {
    getItems() {
      axios.get(`${this.url}getItems`).then(res => {
        let x = res.data.map(rec => {
          return {
            itemcode: rec.itemcode,
            itemname: rec.itemname,
            minimumQty: rec.minimumQty,
            actualQty: rec.actualQty,
            unitname: rec.unitname,
            price: rec.price,
            acutalprice: rec.actualprice,
            supplier: rec.name
          };
        });

        this.itemData = x;
      });
    }
  }
};
</script>

<style>
/* .myTable thead tr th {
  font-size: 20px !important;
  border-top: 1px solid black;
  text-align: center;
  background-color: teal;
  -webkit-text-fill-color: white;
}

.myTable table {
  border: 1px solid black;
} */
</style>
