<template>
  <div>
    <div v-if="isSpuShow">
      <Category></Category>
      <spuShowList v-if="isShow" @showUpdateList="showUpdateList"></spuShowList>
      <SpuUpdateList
        v-else
        :item="item"
        @closeUpdateList="closeUpdateList"
      ></SpuUpdateList>
    </div>
    <skuList v-else></skuList>
  </div>
</template>

<script>
import Category from "@/components/Category";
import spuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import skuList from "./skuList";
export default {
  name: "SpuList",
  data() {
    return {
      isShow: true,
      isSpuShow: false,
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
    skuList,
  },
};
</script>
<style lang="sass" scoped>
>>>.el-pagination
  text-align: right

>>>.el-pagination__sizes
  margin-left: 350px
</style>
