import { defineStore } from "pinia"
import { useOtherStore } from "@/store/otherStore";

export const useStore = defineStore("myGlobalState", {
  state: () => ({
    count: 2
  }),
  getters: {
    // 一个基本的 Getter： 计算 count 的平方
    // 使用参数
    countPow2(state) {
      return state.count ** 2;
    },
    // 使用 this
    /* 
    countPow2() {
      return this.count ** 2;
    }, 
    */
    // 简单的 Getter 直接使用箭头函数
    // countPow2: state=> state.count ** 2

    // 获取其它 Getter， 直接通过 this
    countPow2Getter() {
      return this.countPow2;
    },

    // 使用其它 Store
    otherStoreCount(state) {
      // 这里是其他的 Store，调用获取 Store，就和在 setup 中一样
      const otherStore = useOtherStore();
      return state.count * otherStore.count;
    },
  },
  actions: {
    countPlusOne() {
      console.log(this.count)
      this.count++;
    },
    countPlusOneAsync() {
      setTimeout(() => {
        this.count++
      }, 1000);
    }
  }
});
