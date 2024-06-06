import { createRouter, createWebHistory } from "vue-router";
import AdminRoutes from "./AdminRoutes";
import EmployeeRoutes from "./EmployeeRoutes";
import PersonalRoutes from "./PersonalRoutes";

const roleRoutesMap = {
  ADMIN: {
    allowedRoutes: [
      "admin",
      "admin-home",
      "admin-profile",
      "admin-teams",
      "admin-team",
      "admin-users",
      "admin-user",
      "admin-employee-request",
    ],
    homeRoute: "admin-home",
  },
  EMPLOYEE: {
    allowedRoutes: [
      "employee",
      "employee-home",
      "employee-profile",
      "employee-requests",
      "employee-request",
    ],
    homeRoute: "employee-home",
  },
  PERSONAL: {
    allowedRoutes: [
      "personal",
      "personal-home",
      "personal-profile",
      "personal-employees",
      "personal-employee",
      "personal-requests",
      "personal-employee-request",
    ],
    homeRoute: "personal-home",
  },
};

function isRouteAllowed(role, routeName) {
  return roleRoutesMap[role]?.allowedRoutes.includes(routeName);
}

function getHomeRoute(role) {
  return roleRoutesMap[role]?.homeRoute;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        title: "Welcome",
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/layouts/user.vue"),
      redirect: "/admin/home",
      meta: {
        title: "Dashboard",
      },
      children: AdminRoutes,
    },
    {
      path: "/employee",
      name: "employee",
      component: () => import("@/layouts/user.vue"),
      redirect: "/employee/home",
      meta: {
        title: "Dashboard",
      },
      children: EmployeeRoutes,
    },
    {
      path: "/personal",
      name: "personal",
      component: () => import("@/layouts/user.vue"),
      redirect: "/personal/home",
      meta: {
        title: "Dashboard",
      },
      children: PersonalRoutes,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  document.title = to.meta.title;

  if (!token) {
    next(to.name === "login" ? undefined : { name: "login" });
  } else if (to.name === "login") {
    next({ name: getHomeRoute(role) });
  } else if (isRouteAllowed(role, to.name)) {
    next();
  } else {
    next({ name: getHomeRoute(role) });
  }
});

export default router;
