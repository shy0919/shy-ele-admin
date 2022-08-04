import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import "@/styles/index.scss"
import VueParticles from "vue-particles"
import "@/permission"
import Directives from "@/directives/index"
import vue3JsonExcel from "vue3-json-excel"

const app = createApp(App)
app
  .use(router)
  .use(store)
  .use(ElementPlus)
  .use(VueParticles)
  .use(Directives)
  .use(vue3JsonExcel)
app.mount("#app")

console.log(
  ` 
  < 我是菜狗 >
   ------ 
          \\   ^__^
           \\  (oo)\\_______
              (__)\\       )\\/\\
                  | |----w  |
                  |_|     |_|
                                          `
)
