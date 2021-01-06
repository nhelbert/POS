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
        </v-row>
      </template>
      <template v-slot:item.unitname="{ item }">
        <span v-if="strFilterName">
          <template
            v-for="(fragment, i) in item.unitname.toString().split(new RegExp(`(?<=${strFilterName})|(?=${strFilterName})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterName.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{item.unitname}}</template>
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
        <a-form-item labelAlign="left" label="Unit Name" required style="width:100%">
          <a-input v-model="strName"></a-input>
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
        <a-form-item labelAlign="left" label="Unit Name" required style="width:100%">
          <a-input v-model="objNewUnitsData.unitname"></a-input>
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
      strFilterName: "",
      objNewUnitsData: {},
      objItem: {},
      units: [],
      headers: [
        {
          text: "Unit Name",
          align: "center",
          value: "unitname"
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
      axios.get(this.url + `units`).then(res => {
        this.units = res.data;
      });
    },
    mFilterCustomers() {
      return this.units.filter(data => {
        return data.unitname
          .toUpperCase()
          .includes(this.strFilterName.toUpperCase());
      });
    },
    mEdit(item) {
      this.strId = item.unitid;
      this.strName = item.unitname;
      this.dialogEdit = true;
    },
    mAddNew() {
      this.objNewUnitsData = {};
      this.dialogAdd = true;
    },
    mSelectitem(item) {
      this.isDelete = true;
      this.objItem = item;
    },
    mUpdateCustomers() {
      this.objNewUnitsData = {};
      this.objNewUnitsData.unitid = this.strId;
      this.objNewUnitsData.unitname = this.strName;

      axios.post(this.url + `updatesunits/`, this.objNewUnitsData).then(res => {
        if (res.data.unitid == this.objNewUnitsData.unitid) {
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
      axios.post(this.url + `insertunits/`, this.objNewUnitsData).then(res => {
        if (res.data.unitname == this.objNewUnitsData.unitname) {
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
        this.objNewUnitsData.unitname == undefined ||
        this.objNewUnitsData.unitname == ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    mCheckEdit() {
      if (this.strName == "") {
        return true;
      } else {
        return false;
      }
    },
    mdeleteitem() {
      axios.post(this.url + `deleteunits/`, this.objItem).then(res => {
        if (res.data.unitid == this.objItem.unitid) {
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
