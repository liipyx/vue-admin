import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  getProductList(page, limit) {
    return request.get(`${api_name}/${page}/${limit}`);
  },
  //添加
  addBrand(data) {
    return request({
      method: "POST",
      url: `${api_name}/save`,
      data
    });
  },
  //修改
  updateBrand(data) {
    return request({
      method: "PUT",
      url: `${api_name}/update`,
      data
    })
  }
};
