import { defineStore } from "pinia";
import axios from "axios";

export const useTeamStore = defineStore("team", {
  state: () => ({
    team: null,
    teams: [],
    url: import.meta.env.VITE_API_URL,
  }),
  actions: {
    async createTeam(form) {
      const response = await axios.post(
        `${this.url}/api/v1/teams`,
        {
          name: form.name,
          description: form.description,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      this.team = response.data;
    },
    async getAllTeams() {
      const response = await axios.get(`${this.url}/api/v1/teams`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      this.teams = response.data;
    },
  },
});
