<template>
  <el-card class="box-card">
    <el-form
      :inline="true"
      :model="categoryIds"
      class="demo-form-inline"
      :disabled="isDisabled"
    >
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryIds.id1"
          placeholder="请选择"
          @change="select1(categoryIds.id1)"
        >
          <el-option
            v-for="category1 in category1List"
            :key="category1.id"
            :label="category1.name"
            :value="category1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryIds.id2"
          placeholder="请选择"
          @change="select2(categoryIds.id2)"
        >
          <el-option
            v-for="category2 in category2List"
            :key="category2.id"
            :label="category2.name"
            :value="category2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="categoryIds.id3"
          placeholder="请选择"
          @change="select3(categoryIds.id3)"
        >
          <el-option
            v-for="category3 in category3List"
            :key="category3.id"
            :label="category3.name"
            :value="category3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Category",
  data() {
    return {
      /* categoryList: {
        category1List: [],
        category2List: [],
        category3List: [],
      }, */
      /* category1Id: null,
      category2Id: null,
      category3Id: null, */
      // attrInfoList: [],
    };
  },
  props: {
    isDisabled: Boolean,
  },
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
      categoryIds:(state) => state.category.categoryIds,
    }),
  },
  methods: {
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),
    ...mapMutations(["category/SET_CATEGORY3ID"]),
    async select1(id) {
      /* this.categoryList.category2List=[]
      this.categoryList.category3List=[]
      this.category2Id=null
      this.category3Id=null
      const category2List = await this.$API.attr.getCategory2(id);
      this.categoryList.category2List = category2List.data; */
      this["category/getCategory2List"](id);
      this.$bus.$emit("reSelect");
    },
    async select2(id) {
      /* this.categoryList.category3List=[]
      this.category3Id=null
      const category3List = await this.$API.attr.getCategory3(id);
      this.categoryList.category3List = category3List.data; */
      this["category/getCategory3List"](id);
      this.$bus.$emit("reSelect");
    },
    /* async select3(id1, id2, id3) {
      console.log(333);
      const attrInfoList = await this.$API.attr.getAttrInfoList(id1, id2, id3);
      this.attrInfoList = attrInfoList.data;
    }, */
    select3(id) {
      this["category/SET_CATEGORY3ID"](id);
    },
    onSubmit() {
      console.log("submit!");
    },
  },
  async mounted() {
    /* const category1List = await this.$API.attr.getCategory1();
    this.categoryList.category1List = category1List.data; */
    this["category/getCategory1List"]();
  },
};
</script>

<style lang="less" scoped>
</style>
