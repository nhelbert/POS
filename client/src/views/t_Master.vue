<template>
  <v-container fluid>
    <v-slide-x-transition hide-on-leave>
      <users v-if="sMasterID==1"></users>
      <supplier v-if="sMasterID==2"></supplier>
      <customer v-if="sMasterID==3"></customer>
      <unit v-if="sMasterID==4"></unit>
    </v-slide-x-transition>
  </v-container>
</template>

<script>
import users from "./m_Users";
import supplier from "./m_Supplier";
import customer from "./m_Customer";
import unit from "./m_Unit";

export default {
  components: {
    users,
    unit,
    supplier,
    customer
  },
  data: () => ({})
};
</script>
<style>