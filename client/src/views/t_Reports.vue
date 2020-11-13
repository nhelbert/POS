<template>
  <v-container fluid>
    <v-slide-x-transition hide-on-leave>
      <history v-if="sReportID==1"></history>
      <income v-if="sReportID==2"></income>
    </v-slide-x-transition>
  </v-container>
</template>

<script>
import history from "./r_Transaction_History";
import income from "./r_Income_Monitoring";
export default {
  components: {
    history,
    income
  }
};
</script>
