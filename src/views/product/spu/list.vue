<template>
  <div>
    <Category></Category>
    <spuShowList v-if="isShow" @showUpdateList="showUpdateList"></spuShowList>
    <SpuUpdateList
      v-else
      :item="item"
      @closeUpdateList="closeUpdateList"
    ></SpuUpdateList>
  </div>
</template>

<script>
import Category from "@/components/Category";
import spuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
export default {
  name: "SpuList",
  data() {
    return {
      isShow: true,
      item: {},
    };
  },
  methods: {
    showUpdateList(row) {
      this.isShow = false;
      this.item = { ...row };
    },
    closeUpdateList() {
      this.isShow = true;
    },
  },
  components: {
    Category,
    spuShowList,
    SpuUpdateList,
  },
};
</script>
<style lang="sass" scoped>
>>>.el-pagination
  text-align: right

>>>.el-pagination__sizes
  margin-left: 350px
</style>
