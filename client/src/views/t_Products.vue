<template>
  <v-container fluid class="pa-0">
    <v-slide-x-transition hide-on-leave>
      <items v-if="sProductID==1"></items>
    </v-slide-x-transition>
  </v-container>
</template>

<script>
import items from "./p_Items_Monitoring";

export default {
  components: {
    items
  }
};
</script>
