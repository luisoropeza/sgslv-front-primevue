import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from "./user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    router: useRouter(),
    userStore: useUserStore(),
    url: import.meta.env.VITE_API_URL,
  }),
  actions: {
    async login(form) {
      const response = await axios.post(`${this.url}/auth/login`, {
        username: form.username,
        password: form.password,
      });
      localStorage.setItem("token", response.data.token);
      await this.userStore.getUser();
      localStorage.setItem("role", this.userStore.user.role);
      this.router.push("/admin");
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      this.router.push("/login");
    },
  },
});
