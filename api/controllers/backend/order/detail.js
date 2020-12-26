const moment = require('moment');
module.exports = {
    inputs: {},
    exits: {
      success: {
        viewTemplatePath: 'backend/pages/order/detail',
      },
      redirect: {
        responseType: 'redirect'
      }
    },
    fn: async function (inputs, exits) {
      if (!this.req.me) {
        throw { redirect: '/login' };
      }
      let _default = await sails.helpers.getDefaultData(this.req);
      let productTypeObj = await ProductTypeService.find({status: sails.config.custom.STATUS.ACTIVE});
      //let orders = await OrderService.find({customer: this.req.me.id});
      let idOrder = this.req.param('id');
      let listOrderProduct = await Order_Product.find({order: idOrder}).populate('order').populate('product');
      let orderObj = await OrderService.get({id: idOrder});
      orderObj.orderDate = moment(orderObj.orderDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
      // for(let order of orders) {
      //   order.orderDate = moment(order.orderDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
      // }
      _default.productTypeObj = productTypeObj;
      _default.profile = this.req.me;
      var cart = this.req.session.cart;
      //var shipping = this.req.session.shipping;
      if (cart != undefined) {
      var cart = cart
      } else {
      var cart = 0
      }
      //_default.orders = orders;
      _default.orderObj = orderObj;
      _default.listOrderProduct = listOrderProduct;
      _default.cart = cart;
      //_default.shipping = shipping;
      _default.link = {
        arrlink: [{
          name: "Lịch sử mua hàng",
          link: "/order"
        }],
        linkAcctive: {
          name: "Chi tiết đơn hàng",
          link: `/order/detail/${idOrder}`
        }
      }
      return exits.success(_default);
    }
};