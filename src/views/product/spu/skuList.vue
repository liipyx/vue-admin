<template>
  <div>
    <el-card class="box-card">
      <el-form :model="sku" ref="skuForm" :rules="rules">
        <el-form-item label="SPU 名称" label-width="100px">
          <span>{{skuItem.spuName}}</span>
        </el-form-item>
        <el-form-item label="SKU 名称" label-width="100px" prop="skuName">
          <el-input placeholder="SKU 名称" v-model="sku.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" label-width="100px" prop="price">
          <el-input placeholder="SKU 价格" v-model="sku.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)" label-width="100px" prop="weight">
          <el-input placeholder="SKU 重量" v-model="sku.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述" label-width="100px" prop="skuDesc">
          <el-input type="textarea" placeholder="SKU 规格描述" v-model="sku.skuDesc"></el-input>
        </el-form-item>
        <el-form-item class="select-wrap" label="平台属性" label-width="100px" prop="skuAttrValueList">
          <div>
            <div class="selector" v-for="(attr,index) in attrInfoList" :key="attr.id">
              <span>{{attr.attrName}}</span>
              <el-select placeholder="请选择" v-model="sku.skuAttrValueList[index]">
                <el-option v-for="value in attr.attrValueList" :key="value.id" :label="value.valueName" :value="`${attr.id}-${value.id}`"></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="select-wrap" label="销售属性" label-width="100px" prop="skuSaleAttrValueList">
          <div>
            <div class="selector" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
              <span>{{saleAttr.saleAttrName}}</span>
              <el-select placeholder="请选择" v-model="sku.skuSaleAttrValueList[index]">
                <el-option v-for="attr in saleAttr.spuSaleAttrValueList" :key="attr.id" :label="attr.saleAttrValueName" :value="`${saleAttr.id}-${attr.id}`"></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="select-wrap" label="图片列表" label-width="100px" prop="skuImageList">
          <el-table :data="spuImgList" @selection-change="checkImg" row-key="id" border style="width: 100%">
            <el-table-column type="selection" :reserve-selection="true" width="80">
            </el-table-column>
            <el-table-column label="图片">
              <template v-slot={row}>
                <img :src="row.imgUrl" style="height:100px">
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="imgName"> </el-table-column>
            <el-table-column label="操作">
              <template v-slot={row}>
                <el-tag v-if="row.isDefault" :disable-transitions="true" type="success" plain>默认</el-tag>
                <el-button v-else type="primary" size="mini" @click="setDefault(row)">设为默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button type="primary" @click="save">保存</el-button>
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
        skuAttrValueList:[],
        // skuDefaultImg:"",
        skuImageList:[],
        skuSaleAttrValueList:[],
      },
      rules:{
        skuName:[{required:true,message:"请输入sku名称",trigger:"change"}],
        price:[{required:true,message:"请输入sku价格",trigger:"change"}],
        weight:[{required:true,message:"请输入sku重量",trigger:"change"}],
        skuDesc:[{required:true,message:"请输入sku描述",trigger:"change"}],
        skuAttrValueList:[{required:true,validator:this.skuAttrValueListValidator}],
        skuSaleAttrValueList:[{required:true,validator:this.skuSaleAttrValueListValidator}],
        skuImageList:[{required:true,validator:this.skuImageListValidator}],
      }
    };
  },
  props:{
    skuItem:Object
  },
  computed: {
    ...mapState({
      categoryIds: (state) => state.category.categoryIds,
    }),
  },
  methods: {
    //表单校验
    skuAttrValueListValidator(rule,value,callback){
      if(this.sku.skuAttrValueList.filter(attr=>attr).length !== this.attrInfoList.length){
        callback(new Error("请选择全部平台属性"))
        return
      }
      callback()
    },
    skuSaleAttrValueListValidator(rule,value,callback){
      if(this.sku.skuSaleAttrValueList.filter(attr=>attr).length !== this.spuSaleAttrList.length){
        callback(new Error("请选择全部销售属性"))
        return
      }
      callback()
    },
    skuImageListValidator(rule,value,callback){
      if(this.sku.skuImageList.length <= 0){
        callback(new Error("请选择至少一张图片"))
        return
      }
      if(!this.sku.skuImageList.find(img=>img.isDefault)){
        callback(new Error("请设置至少一张默认图片"))
        return
      }
      callback()
    },
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
      const result = await this.$API.spu.getSpuSaleAttrList(this.skuItem.id)
      if(result.code === 200){
        this.$message.success("获取销售属性成功")
        this.spuSaleAttrList = result.data
      }else{
        this.$message.error("获取销售属性失败")
      }
    },
    //获取图片列表
    async getSpuImg(){
      const result = await this.$API.spu.getSpuImg(this.skuItem.id)
      if(result.code === 200){
        this.$message.success("获取图片列表成功")
        this.spuImgList = result.data.map(img=>({
          ...img,
          isDefault:false
        }))
      }else{
        this.$message.error("获取图片列表失败")
      }
    },
    //选择图片
    checkImg(imgList){
      this.sku.skuImageList = imgList
    },
    //设为默认
    setDefault(row){
      this.spuImgList = this.spuImgList.map((img)=>{
        return {
          ...img,
          isDefault: img.id === row.id? true:false
        }
      })
      this.sku.skuImageList = this.sku.skuImageList.map((img)=>{
        return {
          ...img,
          isDefault: img.id === row.id? true:false
        }
      })
      this.$refs.skuForm.validate((valid)=>{
        if(valid){
          console.log("校验成功")
        }
      })
    },
    save(){
      this.$refs.skuForm.validate((valid)=>{
        if(valid){
          console.log("校验成功")
          
          const skuAttrValueList = this.sku.skuAttrValueList.map(value=>{
            const [attrId,valueId] = value.split("-")
            return {attrId,valueId}
          })
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(value=>{
            const [saleAttrValueId,spuId] = value.split("-")
            return {saleAttrValueId,spuId}
          })
          const skuImageList = this.sku.skuImageList.map(value=>({
            ...value,
            spuImgId: value.id
          }))
         
          const sku = {
            skuAttrValueList,
            skuSaleAttrValueList,
            skuImageList,
            category3Id: this.categoryIds.id3,
            spuId: this.skuItem.id,
            tmId: this.skuItem.tmId
          }

          const result = this.$API.spu.saveSku(sku)
          this.$message.success("保存spu成功")
          this.$emit('closeSkuList')
        }
      })
      /* 
      {
  "category3Id": 0, √
  "id": 0, ×
  "isSale": 0,
  "price": 0, /
  "skuAttrValueList": [ /
    {
      "attrId": 0,
      "id": 0, ×
      "skuId": 0, ×
      "valueId": 0
    }
  ],
  "skuDefaultImg": "string", /
  "skuDesc": "string", /
  "skuImageList": [ /
    {
      "id": 0, ×
      "imgName": "string",
      "imgUrl": "string",
      "isDefault": "string",
      "skuId": 0, ×
      "spuImgId": 0
    }
  ],
  "skuName": "string", /
  "skuSaleAttrValueList": [ /
    {
      "id": 0, ×
      "saleAttrValueId": 0,
      "skuId": 0, ×
      "spuId": 0
    }
  ],
  "spuId": 0, skuItem.id
  "tmId": 0, skuItem.tmId
  "weight": "string" /
}
      */
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
