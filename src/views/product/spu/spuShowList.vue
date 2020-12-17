<template>
  <div>
    <el-card class="box-card" style="margin: 20px 0">
      <el-button type="primary" icon="el-icon-plus" @click="$emit('showUpdateList',{category3Id:id3})">添加SPU</el-button>
      <el-table :data="spuList" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作"
          ><template v-slot="{ row }">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
            ></el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="$emit('showUpdateList', row)"
            ></el-button>
            <el-button size="mini" type="info" icon="el-icon-info"></el-button>
            <el-popconfirm
              @onConfirm="delSpu(row.id)"
              :title="`确定删除 ${row.spuName} 吗?`"
            >
              <el-button
                size="mini"
                slot="reference"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </el-popconfirm>
          ></template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 6, 9, 11]"
      :page-size="limit"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "spuShowList",
  data() {
    return {
      spuList: [],
      id1: null,
      id2: null,
      id3: null,
      page: 1,
      limit: 3,
      total: 0,
    };
  },
  methods: {
    select3(id1, id2, id3) {
      this.id1 = id1;
      this.id2 = id2;
      this.id3 = id3;
      this.getSpuList();
    },
    async getSpuList() {
      const result = await this.$API.spu.getSpuList(
        this.page,
        this.limit,
        this.id3
      );
      this.total = result.data.total;
      this.page = result.data.current;
      this.limit = result.data.size;
      this.spuList = result.data.records;
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //当重新选择一级、二级分类时清空spuList
    clearInfoList() {
      this.spuList = [];
      this.total = 0;
    },
    //当spuShowList组件点击保存或取消按钮切换到此组件时重新获取spu列表
    reGetSpuList(id3) {
      this.id3 = id3;
      this.getSpuList();
    },
    //删除spu
    async delSpu(spuId){
      const result = await this.$API.spu.delSpu(spuId)
      if(result.code === 200){
        this.$message.success("删除spu成功")
      }else{
        this.$message.error(result.message);
      }
      if(this.spuList.length === 1){
        this.page -= 1
      }
      this.getSpuList()
    }
  },
  mounted() {
    this.$bus.$on("change", this.select3);
    this.$bus.$on("reSelect", this.clearInfoList);
    this.$bus.$on("reGetSpuList", this.reGetSpuList);
  },
  beforeDestroy() {
    this.$bus.$off("change", this.select3);
    this.$bus.$off("reSelect", this.clearInfoList);
  },
};
</script>

<style lang="less" scoped>
</style>
