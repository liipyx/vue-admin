import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  getCategory1() {
    return request({
      method: "GET",
      url: `${api_name}/getCategory1`
    });
  },
  getCategory2(category1Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory2/${category1Id}`
    });
  },
  getCategory3(category2Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory3/${category2Id}`
    });
  },
  getAttrInfoList(category1Id, category2Id, category3Id) {
    return request({
      method: "GET",
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    });
  },
  getAttrValueList(attrId) {
    return request({
      method: "GET",
      url: `${api_name}/getAttrValueList/${attrId}`
    });
  },
  saveAttrInfo(attr) {
    return request({
      method: "POST",
      url: `${api_name}/saveAttrInfo`,
      data: attr
    });
  },
  deleteAttr(attrId) {
    return request({
      method: "DELETE",
      url: `${api_name}/deleteAttr/${attrId}`
    });
  }
};
