const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/scanner", component: () => import("pages/ScannerPage.vue") },
      {
        path: "/staff/all",
        component: () => import("pages/StaffPage.vue"),
      },
      {
        path: "/staff",
        component: () => import("components/RegisterForm.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
