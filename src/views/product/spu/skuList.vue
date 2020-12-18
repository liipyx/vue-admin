<template>
  <div>
    <el-card class="box-card">
      <el-form>
        <el-form-item label="SPU 名称" label-width="100px">
          <span>xxx</span>
        </el-form-item>
        <el-form-item label="SKU 名称" label-width="100px">
          <el-input placeholder="SKU 名称"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" label-width="100px">
          <el-input placeholder="SKU 价格"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)" label-width="100px">
          <el-input placeholder="SKU 重量"></el-input>
        </el-form-item>
        <el-form-item label="规格描述" label-width="100px">
          <el-input type="textarea" placeholder="SKU 规格描述"></el-input>
        </el-form-item>
        <el-form-item class="select-wrap" label="平台属性" label-width="100px">
          <div>
            <div class="selector" v-for="attrInfo in attrInfoList" :key="attrInfo.id">
              <span>{{attrInfo.attrName}}</span>
              <el-select placeholder="请选择">
                <el-option v-for="attr in attrInfo.attrValueList" :key="attr.id" :label="attr.valueName" :value="attr.id"></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="select-wrap" label="销售属性" label-width="100px">
          <div>
            <div class="selector" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
              <span>{{saleAttr.saleAttrName}}</span>
              <el-select placeholder="请选择">
                <el-option v-for="attr in saleAttr.spuSaleAttrValueList" :key="attr.id" :label="attr.saleAttrValueName" :value="attr.id"></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="select-wrap" label="图片列表" label-width="100px">
          <el-table :data="spuImgList" border style="width: 100%">
            <el-table-column type="selection" width="80">
            </el-table-column>
            <el-table-column label="图片">
              <template v-slot={row}>
                <img :src="row.imgUrl" style="height:100px">
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="imgName"> </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini">设为默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button type="primary">保存</el-button>
          <el-button @click="$emit('closeSkuList')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      attrInfoList: [],
      spuSaleAttrList:[],
      spuImgList:[],
      sku:{
        imgList:[]
      }
    };
  },
  props:{
    spuId:Number
  },
  computed: {
    ...mapState({
      categoryIds: (state) => state.category.categoryIds,
    }),
  },
  methods: {
    //获取平台属性
    async getAttrInfoList() {
      const result = await this.$API.attr.getAttrInfoList(
        this.categoryIds.id1,
        this.categoryIds.id2,
        this.categoryIds.id3
      );
      if (result.code === 200) {
        this.$message.success("获取平台属性成功");
        this.attrInfoList = result.data;
      } else {
        this.$message.error("获取平台属性失败");
      }
    },
    //获取销售属性
    async getSpuSaleAttrList(){
      const result = await this.$API.spu.getSpuSaleAttrList(this.spuId)
      if(result.code === 200){
        this.$message.success("获取销售属性成功")
        this.spuSaleAttrList = result.data
      }else{
        this.$message.error("获取销售属性失败")
      }
    },
    //获取图片列表
    async getSpuImg(){
      const result = await this.$API.spu.getSpuImg(this.spuId)
      if(result.code === 200){
        this.$message.success("获取图片列表成功")
        this.spuImgList = result.data
      }else{
        this.$message.error("获取图片列表失败")
      }
    }
  },
  mounted() {
    this.getAttrInfoList();
    this.getSpuSaleAttrList()
    this.getSpuImg()
  },
};
</script>

<style lang="sass" scoped>
.selector
  display: inline-block
  width: 33%
  text-align: right
  margin-right: 20px
  margin-bottom: 20px
</style>
