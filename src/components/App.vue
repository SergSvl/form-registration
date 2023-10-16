<template>
  <form-component
    :default-values="{
      username: 'default username',
      email: 'default@email.com',
      role: Roles.student.value
    }"
  />
</template>

<script>
import "../assets/styles/style.css";
import { Roles } from "@/constants/roles.js";
import Registration from "@/components/Registration.vue";

export default {
  name: "App",
  components: {
    "form-component": Registration
  },
  data() {
    return {
      Roles
    }
  }
};
</script>
