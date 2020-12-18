<template>
  <div>
    <div v-if="isSpuShow">
      <Category></Category>
      <spuShowList v-if="isShow" @showUpdateList="showUpdateList" @showSkuList="showSkuList"></spuShowList>
      <SpuUpdateList
        v-else
        :item="item"
        @closeUpdateList="closeUpdateList"
      ></SpuUpdateList>
    </div>
    <skuList v-else @closeSkuList="closeSkuList" :skuItem="skuItem"></skuList>
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
      isSpuShow: true,
      item: {},
      skuItem:{}
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
    showSkuList(row){
      this.isSpuShow = false
      this.skuItem = {...row}
    },
    closeSkuList(){
      this.isSpuShow = true
    },
  },
  components: {
    Category,
    spuShowList,
    SpuUpdateList,
    skuList,
  },
  beforeDestroy(){
    this.$store.commit("category/CLEAR_CATEGORYIDS")
  }
};
</script>
<style lang="sass" scoped>
>>>.el-pagination
  text-align: right

>>>.el-pagination__sizes
  margin-left: 350px
</style>
