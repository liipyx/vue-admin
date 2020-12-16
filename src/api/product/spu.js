import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  //showList数据
  getSpuList(page, limit, category3Id) {
    return request({
      method: "GET",
      url: `${api_name}/${page}/${limit}`,
      params: {
        category3Id
      }
    });
  },
  //销售属性
  getBaseSaleAttrList() {
    return request({
      method: "GET",
      url: `${api_name}/baseSaleAttrList`
    });
  },
  //销售属性列表
  getSpuSaleAttrList(spuId) {
    return request({
      method: "GET",
      url:`${api_name}/spuSaleAttrList/${spuId}`
    })
  },
  //不知
  getSpuBrand(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/getSpuById/${spuId}`
    });
  },
  //品牌数据
  getTrademarkList() {
    return request({
      method: "GET",
      url: `${api_name}/baseTrademark/getTrademarkList`
    });
  },
  //图片数据
  getSpuImg(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/spuImageList/${spuId}`
    });
  },
};