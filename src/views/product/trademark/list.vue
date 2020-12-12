<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    <!-- 弹框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form :model="brandForm" ref="brandForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="brandForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="brandForm.logoUrl"
              :src="brandForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('brandForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="brands" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="brand-img" :src="scope.row.logoUrl" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="操作"
        ><template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          ></template
        >
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="myCurrent"
      :page-sizes="[3, 6, 9, 11]"
      :page-size="myPageSize"
      layout="prev, pager, next, jumper,sizes,total"
      :total="myTotal"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      brands: [],
      myCurrent: 1,
      myPageSize: 3,
      myTotal: 0,
      dialogFormVisible: false,
      brandForm: {
        logoUrl: "",
        tmName: "",
      },
      isAdding: false,
      isEditing: false,
      isEditingId:0,
      rules: {
        logoUrl: [{ required: true, message: "请上传品牌LOGO！" }],
        tmName: [
          { required: true, message: "请输入品牌名称！", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getProductList() {
      try {
        const result = await this.$API.brands.getProductList(
          this.myCurrent,
          this.myPageSize
        );
        if (result.code === 200) {
          this.$message.success("请求列表成功");
          this.brands = result.data.records;
          this.myTotal = result.data.total;
          this.myCurrent = result.data.current;
          this.myPageSize = result.data.size;
        } else {
          console.log(result.data);
          this.$message.error("请求列表失败");
        }
      } catch (err) {
        console.log("err ", err);
        this.$message.error("请求列表失败");
      }
    },
    handleCurrentChange(currentPage) {
      this.myCurrent = currentPage;
      this.getProductList();
    },
    handleSizeChange(myPageSize) {
      this.myPageSize = myPageSize;
      this.getProductList();
    },
    handleAvatarSuccess(res) {
      this.brandForm.logoUrl = res.data;
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
    //提交添加品牌表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.isAdding) {
            const result = await this.$API.brands.addBrand(this.brandForm);
            if (result.code === 200) {
              this.$message.success("添加品牌数据成功");
              this.dialogFormVisible = false;
              this.getProductList();
            } else {
              this.$message.error(result.message);
            }
          }
          if (this.isEditing) {
            const result = await this.$API.brands.updateBrand({
              ...this.brandForm,
              id: this.isEditingId,
            });
            if (result.code === 200) {
              this.$message.success("修改品牌数据成功");
              this.dialogFormVisible = false;
              this.getProductList();
            }
          }
          this.isAdding = false;
          this.isEditing = false;
        }
      });
    },
    // 添加
    add() {
      this.dialogFormVisible = true;
      this.isAdding = true;
    },
    //编辑
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
      this.isEditing = true;
      this.brandForm.tmName = row.tmName;
      this.brandForm.logoUrl = row.logoUrl
      this.isEditingId = row.id
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该品牌, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$API.brands.deleteBrand(row.id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getProductList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getProductList();
  },
};
</script>


<style lang="sass" scoped>
.el-table
  margin: 20px 0

.brand-img
  width: 100px

.el-pagination
  text-align: right

>>>.el-pagination__sizes
  margin-left: 350px

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
