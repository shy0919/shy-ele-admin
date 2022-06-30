<template>
  <div>
    <div class="navbar">
      <div class="navbar-logo">
        <span class="logo-text">Vue3管理系统</span>
      </div>
      <div class="logout" @click="logOut">
        注销
      </div>
    </div>
    <div class="container">
      <div class="sidebar-container">
        <el-menu
          background-color="#eeeeee"
          :default-active="activeMenu"
          :unique-opened="true"
        >
          <div v-for="route in routes" :key="route.path">
            <!-- 一层路由 即children只有一个子项-->
            <div v-if="route.component?.name =='Layout'">
              <router-link v-if="route.children.length <= 1" :to="route.path">
                <el-menu-item :index="resolvePath(route.path,route.path)">
                  <i :class="'iconfont '+ route.children[0].meta.icon" />
                  <span> {{ route.children[0].meta.title }}</span>
                </el-menu-item>
              </router-link>
              <!-- 二层路由 children多个子项-->
              <el-sub-menu v-else :index="resolvePath(route.path,route.path)" poper-append-to-body>
                <template #title>
                  <i :class="'iconfont '+ route.meta.icon" />
                  <span> {{ route.meta.title }}</span>
                </template>
                <router-link v-for="item in route.children" :key="item.path" :to="route.path +'/'+item.path">
                  <el-menu-item :index="resolvePath(item.path,route.path)">
                    <i :class="'iconfont '+ item.meta.icon" />
                    <span> {{ item.meta.title }}</span>
                  </el-menu-item>
                </router-link>
              </el-sub-menu>
            </div>
          </div>
        </el-menu>
      </div>
      <div class="page">
        <bread-crumb />
        <div class="page-main">
          <router-view v-slot="{ Component }">
            <transition name="slide" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isExternal } from '@/utils/validate.js'
import path from 'path'
import BreadCrumb from '../components/breadCrumb'
import { ElMessage, ElMessageBox } from 'element-plus'
export default ({
  name: 'Layout',
  components: { BreadCrumb },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const routes = computed(() => {
      return router.options.routes
    })

    // 激活菜单
    const activeMenu = computed(() => {
      const { path } = route
      return path
    })

    // 解析路径
    const resolvePath = (routePath, basePath) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basePath)) {
        return basePath
      }
      return path.resolve(basePath, routePath)
    }
    // 注销
    const logOut = () => {
      ElMessageBox.confirm(
        '确定要注销吗',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage({
          type: 'success',
          message: '注销成功'
        })
        localStorage.removeItem('loginfo')
        router.push('login')
      })
    }
    return {
      routes,
      resolvePath,
      activeMenu,
      logOut
    }
  }
})
</script>

<style scoped lang='scss'>
.navbar{
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 999;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #74759b;
  .navbar-logo{
    display: flex;
    justify-content: center;
    align-items: center;
    .logo-text{
      line-height: 50px;
    }
  }
  .logout{
    cursor: pointer;
  }
}
.container{
  display: flex;
  height: calc(100vh - 50px) ;
  .page{
    position: relative;
    width: calc(100% - 220px);
    padding-bottom: 10px;
    min-height: calc(100vh - 50px);
    margin-left: 220px;
    .page-main{
      padding: 10px;
      background-color: #ddd;
      margin: 10px;
      border-radius: 10px;
      height: calc(90vh - 50px);
    }
  }
}
.sidebar-container {
  width: 220px !important;
  position: fixed;
  font-size: 0px;
  top: 50px;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;

  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }
}
.slide-enter-from,.slide-leave-to{
  opacity: 0;
  transform: translateX(10px);
}
.slide-enter-from,.slide-leave-to{
  transition: all .5s ease;
}

</style>
