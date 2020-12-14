<template>
<div>
  <Category></Category>
  <spuShowList v-if="isShow" @showUpdateList="showUpdateList" @closeUpdateList="closeUpdateList"></spuShowList>
  <SpuUpdateList v-else :item="item"></SpuUpdateList>
</div>
</template>

<script>
import Category from "@/components/Category";
import spuShowList from "./spuShowList"
import SpuUpdateList from "./spuUpdateList"
export default {
  name: 'SpuList',
  data(){
    return {
      isShow:true,
      item:{}
    }
  },
  methods:{
    showUpdateList(row){
      this.isShow = false
      this.item = {...row}
    },
    closeUpdateList(){
      console.log(111)
      this.isShow = true
    }
  },
  components:{
    Category,
    spuShowList,
    SpuUpdateList
  }
}
</script>
