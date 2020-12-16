<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <el-form ref="attr" :model="spu" label-width="80px">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input placeholder="请输入属性名" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="tmId">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option
              v-for="brand in spuBrand"
              :key="brand.id"
              :label="brand.tmName"
              :value="brand.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            placeholder="SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="imgList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select
            v-model="saleAttrId"
            :placeholder="`还有${saleAttrList.length}未选择`"
          >
            <el-option
              v-for="saleAttr in saleAttrList"
              :key="saleAttr.id"
              :label="saleAttr.name"
              :value="saleAttr.id"
            ></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="spuSaleAttrList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column
          label="属性名"
          width="150px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="属性值名称列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrVal in row.spuSaleAttrValueList"
              :key="attrVal.id"
              >{{ attrVal.saleAttrValueName }}</el-tag
            >
          </template>
          <!-- <el-button>随便一个标签，这个标签不显示</el-button> -->
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template>
            <el-popconfirm title="这是一段内容确定删除吗？">
              <el-button
                size="mini"
                slot="reference"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancle">取消</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuUpdateList",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: this.item,
      baseSaleAttrList: [],
      spuSaleAttrList: [],
      spuBrand: {},
      imgList: [],
      brandId: null,
      saleAttrId: null,
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  props: {
    item: Object,
  },
  computed: {
    saleAttrList() {
      return this.baseSaleAttrList.filter((attr) => {
        return !this.spuSaleAttrList.find(
          (item) => item.baseSaleAttrId === attr.id
        );
      });
    },
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //获取所有销售属性
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList();
      this.baseSaleAttrList = result.data;
    },
    //获取销售属性值列表
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("获取属性列表成功");
        this.spuSaleAttrList = result.data;
      }
    },
    //获取所以品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      this.spuBrand = result.data;
    },
    //获取图片数据
    async getSpuImg() {
      const result = await this.$API.spu.getSpuImg(this.spu.id);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~");
        this.imgList = result.data.map((img) => {
          return {
            id: img.id,
            name: img.imgName,
            url: img.imgUrl,
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },
    cancle() {
      this.$emit("closeUpdateList");
    },
    handlePictureCardPreview() {},
    handleRemove() {},
  },
  mounted() {
    this.getBaseSaleAttrList();
    this.getTrademarkList();
    this.getSpuImg();
    this.getSpuSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
