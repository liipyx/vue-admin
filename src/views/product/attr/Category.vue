<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="categoryList" class="demo-form-inline" :disabled="isDisabled">
      <el-form-item label="一级分类">
        <el-select
          v-model="category1Id"
          placeholder="请选择"
          @change="select1(category1Id)"
        >
          <el-option
            v-for="category1 in categoryList.category1List"
            :key="category1.id"
            :label="category1.name"
            :value="category1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category2Id"
          placeholder="请选择"
          @change="select2(category2Id)"
        >
          <el-option
            v-for="category2 in categoryList.category2List"
            :key="category2.id"
            :label="category2.name"
            :value="category2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category3Id"
          placeholder="请选择"
          @change="$emit('change', category1Id, category2Id, category3Id)"
        >
          <el-option
            v-for="category3 in categoryList.category3List"
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
export default {
  name: "Category",
  data() {
    return {
      categoryList: {
        category1List: [],
        category2List: [],
        category3List: [],
      },
      category1Id: null,
      category2Id: null,
      category3Id: null,
      attrInfoList: [],
    };
  },
  props:{
    isDisabled:Boolean
  },
  methods: {
    async select1(id) {
      this.categoryList.category2List=[]
      this.categoryList.category3List=[]
      this.category2Id=null
      this.category3Id=null
      const category2List = await this.$API.attr.getCategory2(id);
      this.categoryList.category2List = category2List.data;
      this.$listeners.reSelect()
    },
    async select2(id) {
      this.categoryList.category3List=[]
      this.category3Id=null
      const category3List = await this.$API.attr.getCategory3(id);
      this.categoryList.category3List = category3List.data;
      this.$listeners.reSelect()
    },
    /* async select3(id1, id2, id3) {
      console.log(333);
      const attrInfoList = await this.$API.attr.getAttrInfoList(id1, id2, id3);
      this.attrInfoList = attrInfoList.data;
    }, */
    onSubmit() {
      console.log("submit!");
    },
  },
  async mounted() {
    const category1List = await this.$API.attr.getCategory1();
    this.categoryList.category1List = category1List.data;
  }
};
</script>

<style lang="less" scoped>
</style>
