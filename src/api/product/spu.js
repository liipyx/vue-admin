import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  getSpuList(page,limit,category3Id) {
    return request({
      method: "GET",
      url: `${api_name}/${page}/${limit}`,
      params: {
        category3Id
      }
    })
  },
  //销售属性
  getBaseSaleAttrList() {
    return request({
      method: "GET",
      url: `${api_name}/baseSaleAttrList`
    })
  },
  //不知
  getSpuBrand(spuId) {
    return request({
      method: "GET",
      url:`${api_name}/getSpuById/${spuId}`
    })
  },
  getTrademarkList() {
    return request({
      method: "GET",
      url:`${api_name}/baseTrademark/getTrademarkList`
    })
  }
};
