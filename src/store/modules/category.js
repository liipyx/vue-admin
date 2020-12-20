import {Message} from "element-ui"
// import * as API from "@/api"
import API from "@/api"

export default {
  namespaced:true,
  state: {
    categoryIds: {
      id1: "",
      id2: "",
      id3:""
    },
    category1List:[],
    category2List:[],
    category3List:[],
  },
  actions: {
    async getCategory1List({ commit }) {
      const result = await API.category.getCategorys1()
      if (result.code === 200) {
        commit("GET_CATEGORY1LIST", result.data)
        return
      }
      Message.error("获取一级分类失败 ",result.message)
    },
    async getCategory2List({ commit },id1) {
      const result = await API.category.getCategorys2(id1)
      if (result.code !== 200) {
        Message.error("获取二级分类失败 ",result.message)
      }
      commit("GET_CATEGORY2LIST",{category2List:result.data,id1})
    },
    async getCategory3List({ commit },id2) {
      const result = await API.category.getCategorys3(id2)
      if (result.code !== 200) {
        Message.error("获取三级分类失败 ",result.message)
      }
      commit("GET_CATEGORY3LIST",{category3List:result.data,id2})
    },
  },
  mutations: {
    GET_CATEGORY1LIST(state,category1List) {
      state.category1List = category1List
    },
    GET_CATEGORY2LIST(state, { category2List, id1 }) {  //选择一级分类
      state.categoryIds.id2 = ""
      state.categoryIds.id3 = ""
      state.category3List = []
      state.categoryIds.id1 = id1
      state.category2List = category2List
    },
    GET_CATEGORY3LIST(state, { category3List,id2 }) {  //选择二级分类
      state.categoryIds.id3 = ""
      state.categoryIds.id2 = id2
      state.category3List = category3List
    },
    SET_CATEGORY3ID(state, id3) {
      state.categoryIds.id3 = id3
    },
    CLEAR_CATEGORYIDS(state) {
      state.categoryIds.id1 = ""
      state.categoryIds.id2 = ""
      state.categoryIds.id3 = ""
    }
  }
}