<template>
  <div>
    <Category @change="select3" @reSelect="clearInfoList"></Category>
    <el-card class="box-card" style="margin-top:20px">
      <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfoList.length">添加属性</el-button>
      <el-table :data="attrInfoList" border style="width: 100%;margin-top:20px">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150"> </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="scope">
            <el-tag type="info" style="margin-right:5px" v-for="attrVal in scope.row.attrValueList" :key="attrVal.id">{{attrVal.valueName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150"
          ><template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              ></el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              ></el-button
            ></template
          >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Category from "./Category"
export default {
  name: "AttrList",
  data(){
    return {
      attrInfoList:[],
    }
  },
  methods:{
    async select3(id1,id2,id3){
      console.log(id1,id2,id3)
      const attrInfoList = await this.$API.attr.getAttrInfoList(id1,id2,id3)
      this.attrInfoList = attrInfoList.data
    },
    //当重新选择一级、二级分类时清空attrInfoList
    clearInfoList(){
      this.attrInfoList = []
    }
  },
  components:{
    Category
  }
};
</script>
