<template>
  <div>
    <Category
      @change="select3"
      @reSelect="clearInfoList"
      :isDisabled="isDisabled"
    ></Category>
    <el-card v-if="isShow" class="box-card" style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!btnIsAble"
        @click="addAttr"
        >添加属性</el-button
      >
      <el-table
        :data="attrInfoList"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="scope">
            <el-tag
              type="info"
              style="margin-right: 5px"
              v-for="attrVal in scope.row.attrValueList"
              :key="attrVal.id"
              >{{ attrVal.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150"
          ><template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button
          ></template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加属性/编辑属性 -->
    <el-card v-else class="box-card" style="margin-top: 20px">
      <el-form ref="attr" :model="attr" inline>
        <el-form-item label="属性名">
          <el-input
            v-model="attr.attrName"
            placeholder="请输入属性名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttrValue"
        :disabled="!attr.attrName"
        >添加属性值</el-button
      >
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row,$index }">
            <el-input
              v-if="row.isEditing"
              v-model="row.valueName"
              placeholder="请输入属性名"
              ref="input"
              @blur="editCompleted(row,$index)"
              @keyup.enter.native="editCompleted(row)"
              size="mini"
            >
            </el-input>
            <span
              v-else
              style="display: inline-block; width: 100%"
              @click="edit(row)"
              >{{ row.valueName }}</span
            >
          </template>
          <el-button>随便一个标签，这个标签不显示</el-button>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="del(row, $index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="saveAttr">保存</el-button>
      <el-button @click="cancleEditeAttr">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "./Category";
export default {
  name: "AttrList",
  data() {
    return {
      attrInfoList: [],
      isShow: true,
      btnIsAble: false,
      isDisabled: false,
      id1: null,
      id2: null,
      id3: null,
      attr: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  methods: {
    async select3(id1, id2, id3) {
      console.log(id1, id2, id3);
      this.id1 = id1;
      this.id2 = id2;
      this.id3 = id3;
      const attrInfoList = await this.$API.attr.getAttrInfoList(id1, id2, id3);
      this.attrInfoList = attrInfoList.data;
      this.btnIsAble = true;
    },
    //当重新选择一级、二级分类时清空attrInfoList
    clearInfoList() {
      this.attrInfoList = [];
      this.btnIsAble = false;
    },
    //添加属性
    addAttr() {
      this.isShow = false;
      this.isDisabled = true;
      this.attr = {
        attrName: "",
        attrValueList: [],
        categoryId: this.id3,
        categoryLevel: 3,
      };
      // this.attr.categoryId = this.id3;
      // this.attr.categoryLevel = 3;
    },
    //编辑属性
    async handleEdit(index, row) {
      console.log(row);
      this.isShow = false;
      this.isDisabled = true;
      /* const attrValueList = await this.$API.attr.getAttrValueList(row.id);
      console.log(attrValueList);
      this.attr.attrName = row.attrName;
      this.attr.attrValueList = attrValueList.data;
      this.attr.categoryId = row.categoryId;
      this.attr.categoryLevel = row.categoryLevel;
      this.attr.id = row.id; */
      this.attr = JSON.parse(JSON.stringify(row));
    },
    //取消编辑/添加属性
    cancleEditeAttr() {
      this.isShow = true;
      this.isDisabled = false;
    },
    // 编辑具体属性
    edit(row) {
      console.log(row);
      this.$set(row, "isEditing", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
      console.log(row);
    },
    editCompleted(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        row.isEditing = false;
      }
    },
    //添加属性值
    addAttrValue() {
      this.attr.attrValueList.push({ isEditing: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //保存
    async saveAttr() {
      console.log(this.attr);
      const result = await this.$API.attr.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("保存成功");
        this.isShow = true;
        this.isDisabled = false;
        const attrInfoList = await this.$API.attr.getAttrInfoList(
          this.id1,
          this.id2,
          this.id3
        );
        this.attrInfoList = attrInfoList.data;
      }
    },
    //删除属性
    async handleDelete(index, row) {
      console.log(row);
      const result = await this.$API.attr.deleteAttr(row.id);
      console.log(result);
      const attrInfoList = await this.$API.attr.getAttrInfoList(
        this.id1,
        this.id2,
        this.id3
      );
      this.attrInfoList = attrInfoList.data;
    },
    //删除具体属性值
    del(index) {
      console.log(111);
      console.log(index);
      this.attr.attrValueList.splice(index, 1);
    },
  },
  components: {
    Category,
  },
};
</script>
