export default [
  {
    path: "home",
    name: "employee-home",
    component: () => import("@/views/employee/DashboardView.vue"),
  },
  {
    path: "profile",
    name: "employee-profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    path: "requests",
    name: "employee-requests",
    component: () => import("@/views/employee/RequestsView.vue"),
  },
  {
    path: "request/:id",
    name: "employee-request",
    component: () => import("@/views/employee/RequestView.vue"),
  },
];
