<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        >添加SPU</el-button
      >
      <el-table
        :data="spuList"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称">
        </el-table-column>
        <el-table-column prop="description" label="SPU描述">
        </el-table-column>
        <el-table-column label="操作"
          ><template v-slot={row}>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
            ></el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="$emit('showUpdateList',row)"
            ></el-button>
            <el-button
              size="mini"
              type="info"
              icon="el-icon-info"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button
          ></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "spuShowList",
  data(){
    return {
      spuList:[],
      id1:null,
      id2:null,
      id3:null,
      page:1,
      limit:3
    }
  },
  methods:{
    async select3(id1, id2, id3) {
      console.log(id1, id2, id3);
      this.id1 = id1;
      this.id2 = id2;
      this.id3 = id3;
      const result = await this.$API.spu.getSpuList(this.page,this.limit,this.id3);
      console.log(result)
      this.spuList = result.data.records;
      console.log(this.spuList)
    },
  },
  mounted(){
    this.$bus.$on("change",this.select3)
  },
  beforeDestroy(){
    this.$bus.$off("change")
  }
};
</script>

<style lang="less" scoped>
</style>
