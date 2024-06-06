import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    users: [],
    url: import.meta.env.VITE_API_URL,
  }),
  actions: {
    async createUser(form) {
      const response = await axios.post(
        `${this.url}/api/v1/users`,
        {
          username: form.username,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          birthDay: form.birthDay,
          role: form.role,
          team: form.team,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      this.user = response.data;
    },
    async importUsers(data) {
      const response = await axios.post(
        `${this.url}/api/v1/users/import`,
        {
          users: data,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      this.users = response.data;
    },
    async updateUser(form) {
      const response = await axios.put(
        `${this.url}/api/v1/user`,
        {
          username: form.username,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          birthDay: form.birthDay,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      this.user = response.data;
      localStorage.setItem("token", response.data.token);
    },
    async updateUserById(id, form) {
      const response = await axios.put(
        `${this.url}/api/v1/user/${id}`,
        {
          username: form.username,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          birthDay: form.birthDay,
          role: form.role,
          team: form.team,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      this.user = response.data;
    },
    async getUser() {
      const response = await axios.get(`${this.url}/api/v1/user`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      this.user = response.data;
    },
    async getUserById(id) {
      const response = await axios.get(`${this.url}/api/v1/user/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      this.user = response.data;
    },
    async getAllUsers() {
      const response = await axios.get(`${this.url}/api/v1/users`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      this.users = response.data;
      this.users.reverse();
    },
    async getUsersByTeam(id) {
      const response = await axios.get(`${this.url}/api/v1/team/${id}/users`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      this.users = response.data;
      this.users.reverse();
    },
  },
});
