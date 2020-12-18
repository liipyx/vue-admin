<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <el-form :model="spu" label-width="80px" :rules="rules" ref="spuForm">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input placeholder="请输入属性名" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="tmId">
          <el-select v-model="spu.tmId" placeholder="请选择品牌">
            <el-option
              v-for="tm in spuBrand"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input
            type="textarea"
            placeholder="SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片" prop="imgList">
          <el-upload
            :limit="5"
            :on-exceed="exceed"
            accept="image/*"
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="imgShowList"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性" prop="saleAttr">
          <el-select
            v-model="spu.sale"
            :placeholder="`还有${saleAttrList.length}未选择`"
          >
            <el-option
              v-for="saleAttr in saleAttrList"
              :key="saleAttr.id"
              :label="saleAttr.name"
              :value="`${saleAttr.id}-${saleAttr.name}`"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addAttrValue"
            :disabled="!spu.sale"
            >添加属性值</el-button
          >
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
          <template v-slot="{ row, $index }">
            <el-tag
              @close="delTag(index, row)"
              closable
              style="margin-right: 5px"
              v-for="(attrVal, index) in row.spuSaleAttrValueList"
              :key="attrVal.id"
              >{{ attrVal.saleAttrValueName }}</el-tag
            >
            <el-input
              v-if="row.isEditing"
              v-model="addAttrText"
              placeholder="名称"
              style="width: 100px"
              size="small"
              ref="attrInput"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
            ></el-input>
            <el-button
              v-else
              icon="el-icon-plus"
              size="small"
              @click="addValue(row)"
              >添加</el-button
            >
          </template>
          <!-- <el-button>随便一个标签，这个标签不显示</el-button> -->
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              @onConfirm="del($index)"
              :title="`确定删除 ${row.saleAttrName} 吗?`"
            >
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
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancle">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import {mapState} from "vuex"
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
      dialogImageUrl: "",
      dialogVisible: false,
      addAttrText: "",
      rules: {
        spuName: [
          { required: true, message: "请输入属性名！", trigger: "blur" },
        ],
        tmId: [{ required: true, message: "请选择品牌！", trigger: "blur" }],
        description: [
          { required: true, message: "请添加属性描述", trigger: "blur" },
        ],
        imgList: [{ required: true, validator: this.imgValidator }],
        saleAttr: [{ required: true, validator: this.attrValidator }],
      },
    };
  },
  props: {
    item: Object,
  },
  computed: {
    ...mapState({
      categoryIds:state=>state.category.categoryIds
    }),
    saleAttrList() {
      return this.baseSaleAttrList.filter((attr) => {
        return !this.spuSaleAttrList.find(
          (item) => item.baseSaleAttrId === attr.id
        );
      });
    },
    imgShowList() {
      return this.imgList.map((img) => {
        return {
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
  },
  methods: {
    //自定义表单校验
    imgValidator(rules, value, callback) {
      if (this.imgList.length <= 0) {
        callback(new Error("请上传至少一张图片！"));
        return;
      }
      callback();
    },
    attrValidator(rules, value, callback) {
      if (this.spuSaleAttrList.length <= 0) {
        callback(new Error("请选择至少一个销售属性！"));
        return;
      }
      const isNotOk = this.spuSaleAttrList.some(
        (saleAttr) => saleAttr.spuSaleAttrValueList.length <= 0
      );
      if (isNotOk) {
        callback(new Error("请添加至少一个销售属性值！"));
        return;
      }
      callback();
    },
    //删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.imgList = this.imgList.filter((img) => img.imgUrl !== file.url);
    },
    //图片大图预览
    handlePictureCardPreview(file) {
      console.log(file);
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
        this.imgList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    handleAvatarSuccess(res, file) {
      this.imgList.push({
        imgName: file.name,
        imgUrl: res.data,
        uid: file.uid,
        spuId: this.spu.id,
      });
    },
    beforeAvatarUpload(file) {
      const validType = ["image/jpeg", "image/jpg", "image/png"];
      const isValidType = validType.indexOf(file.type) > -1;
      const isLimitSize = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG/PNG 格式!");
      }
      if (!isLimitSize) {
        this.$message.error("上传品牌LOGO大小不能超过 50 kb!");
      }
      return isValidType && isLimitSize;
    },
    exceed() {
      this.$message("上传图片数量超出限制");
    },
    //添加属性值按钮
    addAttrValue() {
      const { sale, id } = this.spu;
      const [baseSaleAttrId, saleAttrName] = sale.split("-");
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: id,
        spuSaleAttrValueList: [],
      });
      this.spu.sale = "";
    },
    //添加按钮
    addValue(row) {
      this.$set(row, "isEditing", true);
      this.$nextTick(() => {
        this.$refs.attrInput.focus();
      });
    },
    //完成编辑
    editCompleted(row, index) {
      if (this.addAttrText) {
        row.spuSaleAttrValueList.push({
          spuId: this.spu.id,
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrValueName: this.addAttrText,
          saleAttrName: row.saleAttrName,
        });
        this.addAttrText = "";
      }
      row.isEditing = false;
    },
    //删除标签
    delTag(index, row) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //删除整个属性
    del(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    //保存
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          console.log("校验通过");
          const spuInfo = {
            ...this.spu,
            category3Id:this.categoryIds.id3,
            spuImageList: this.imgList,
            spuSaleAttrList: this.spuSaleAttrList,
          }
          let result
          if(this.spu.id){
            result = await this.$API.spu.updateSpu(spuInfo);
          }else{
            result = await this.$API.spu.savaSpu(spuInfo);
          }
          if (result.code === 200) {
            this.$message.success("保存spu成功");
            this.$emit("closeUpdateList");
            /* this.$nextTick(() => {
              this.$bus.$emit("reGetSpuList", this.spu.category3Id);
            }); */
          } else {
            this.$message.error("保存spu失败");
          }
        }
      });
    },
    cancle() {
      this.$emit("closeUpdateList");
      /* this.$nextTick(() => {
        this.$bus.$emit("reGetSpuList", this.spu.category3Id);
      }); */
    },
  },
  mounted() {
    this.getBaseSaleAttrList();
    this.getTrademarkList();
    if (this.spu.id) {
      this.getSpuImg();
      this.getSpuSaleAttrList();
    }
  },
};
</script>

<style lang="less" scoped>
</style>
