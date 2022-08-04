import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layout";
const routes = [
  {
    path: "/",
    redirect: "/home/index",
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () => import("@/views/login/login"),
  },
  {
    path: "/home",
    component: Layout,
    redirect: "/home/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/home/index"),
        meta: { title: "首页", icon: "icon-aislogo" },
      },
    ],
  },
  {
    path: "/func",
    component: Layout,
    redirect: "/func/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/func/index"),
        meta: { title: "function", icon: "icon-aislogo" },
      },
    ],
  },
  {
    path: "/example",
    component: Layout,
    redirect: "/example/table",
    meta: { title: "例子", icon: "icon-aislogo" },
    children: [
      {
        path: "table",
        name: "Table",
        component: () => import("@/views/example/table"),
        meta: { title: "表格" },
      },
      {
        path: "chart",
        name: "Chart",
        component: () => import("@/views/example/canvasRect"),
        meta: { title: "图例" },
      },
    ],
  },
  {
    path: "/project",
    component: Layout,
    redirect: "/project/income",
    meta: { title: "项目", icon: "icon-aislogo" },
    children: [
      {
        path: "music",
        name: "Music",
        component: () => import("@/views/project/music"),
        meta: { title: "音乐" },
      },
      {
        path: "require",
        name: "Require",
        component: () => import("@/views/project/require"),
        meta: { title: "需求" },
      },
      {
        path: "fabric",
        name: "Fabric",
        component: () => import("@/views/project/fabric"),
        meta: { title: "fabric" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
