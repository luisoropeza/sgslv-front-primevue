export default [
  {
    path: "home",
    name: "admin-home",
    component: () => import("@/views/admin/DashboardView.vue"),
  },
  {
    path: "profile",
    name: "admin-profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    path: "teams",
    name: "admin-teams",
    component: () => import("@/views/admin/TeamsView.vue"),
  },
  {
    path: "users",
    name: "admin-users",
    component: () => import("@/views/admin/UsersView.vue"),
  },
];
