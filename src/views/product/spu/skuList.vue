<template>
  <div>
    <el-card class="box-card">
      <el-form>
        <el-form-item label="SPU名称" label-width="100px">
          <span>xxx</span>
        </el-form-item>
        <el-form-item label="SKU名称" label-width="100px">
          <el-input placeholder="SKU名称"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" label-width="100px">
          <el-input placeholder="SKU价格"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)" label-width="100px">
          <el-input placeholder="SKU重量"></el-input>
        </el-form-item>
        <el-form-item label="规格描述" label-width="100px">
          <el-input type="textarea" placeholder="SKU规格描述"></el-input>
        </el-form-item>
        <el-form-item class="select-wrap" label="平台属性" label-width="100px">
          <div class="platformSelect">
            <span>xxx</span>
            <el-select placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="select-wrap" label="销售属性" label-width="100px">
          <div class="platformSelect">
            <span>xxx</span>
            <el-select placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item class="select-wrap" label="图片列表" label-width="100px">
          <el-table :data="{}" border style="width: 100%">
            <el-table-column prop="date" label="日期" width="80">
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
};
</script>

<style lang="sass" scoped>
.platformSelect
  display: inline-block
  margin-right: 20px
  margin-bottom: 20px
</style>
