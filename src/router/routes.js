const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "viewProfile",
        path: "/viewProfile",
        component: () => import("pages/ViewProfile.vue"),
      },
      {
        name: "profile",
        path: "/profile/:name",
        component: () => import("pages/Profile.vue"),
      },
      {
        name: "streaming",
        path: "/streaming/:name",
        component: () => import("pages/ViewStreaming.vue"),
      },
      {
        name: "streamings",
        path: "/streamings",
        component: () => import("pages/StreamingList.vue"),
      },
      {
        name: "dms",
        path: "/dms",
        component: () => import("pages/DirectMessages.vue"),
      },
      {
        name: "dm",
        path: "/dm/:name",
        component: () => import("pages/DirectMessage.vue"),
      },
      {
        name: "passwordRecovery",
        path: "/recoveryPassword/:token",
        component: () => import("pages/PasswordRecovery.vue"),
      },
      //Para los 404
      {
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
      },
    ],
  },
];

export default routes;
