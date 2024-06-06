<template>
  <div class="flex min-h-full">
    <div class="w-full max-md:hidden flex items-center justify-center image">
      <div class="w-full flex items-center justify-center">
        <div class="flex flex-col items-center justify-center gap-8 text-white">
          <div class="text-3xl">Welcome your App License</div>
          <div>Manage your licenses and vacations efficiently</div>
        </div>
      </div>
    </div>
    <div
      class="w-[35rem] max-md:w-full flex items-center justify-center bg-gradient-to-t from-white to-primary-100"
    >
      <div class="w-full flex items-center justify-center p-2">
        <div class="flex flex-col items-center justify-center gap-8">
          <div class="text-lg text-surface-600">Enter your credentials</div>
          <div class="flex flex-col gap-5">
            <div class="flex flex-col">
              <label for="username" class="px-1 text-xs text-surface-600"
                >Username</label
              >
              <InputText
                id="username"
                v-model="form.username"
                autocomplete="off"
              />
            </div>
            <div class="flex flex-col">
              <label for="password" class="px-1 text-xs text-surface-600"
                >Password</label
              >
              <Password
                inputId="password"
                v-model="form.password"
                toggleMask
                :feedback="false"
                @keyup.enter="login"
              />
            </div>
          </div>
          <Button label="Log in" size="small" @click="login" />
          <small v-if="message" class="text-red-700">{{ message }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const form = ref({
  username: null,
  password: null,
});
const message = ref(null);

const login = async () => {
  try {
    await authStore.login(form.value);
  } catch (error) {
    message.value = error.response.data.message;
  }
};
</script>

<style scoped>
.image {
  background: url("../assets/Lotus-2s-1920px.svg") no-repeat center center;
  background-size: cover;
}
</style>
