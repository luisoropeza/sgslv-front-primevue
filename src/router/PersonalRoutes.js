export default [
  {
    path: "home",
    name: "personal-home",
    component: () => import("@/views/personal/DashboardView.vue"),
  },
  {
    path: "profile",
    name: "personal-profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    path: "users",
    name: "personal-employees",
    component: () => import("@/views/personal/UsersView.vue"),
  },
  {
    path: "user/:id",
    name: "personal-employee",
    component: () => import("@/views/personal/UserView.vue"),
  },
  {
    path: "requests",
    name: "personal-requests",
    component: () => import("@/views/personal/RequestsView.vue"),
  },
  {
    path: "user/:employeeId/request/:requestId",
    name: "personal-employee-request",
    component: () => import("@/views/personal/RequestView.vue"),
  },
];
