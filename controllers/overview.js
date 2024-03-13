const moment = require("moment");
const Order = require("../models/Order");
const errorHandler = require("../helpers/errorHandler");

module.exports.overview = async function (req, res) {
  try {
    const allOrders = await Order.find({}).sort({ date: 1 });
    const ordersMap = getOrdersMap(allOrders);
    const yesterdayOrders =
      ordersMap[moment().add(-1, "d").format("DD.MM.YYYY")] || [];

    const yesterdayOrdersNumber = yesterdayOrders.length;
    const totalOrdersNumber = allOrders.length;
    const totalDaysNumber = Object.keys(ordersMap).length;
    const ordersPerDay = (totalOrdersNumber / totalDaysNumber).toFixed(0);
    const ordersPercent = (
      (yesterdayOrdersNumber / ordersPerDay - 1) *
      100
    ).toFixed(2);
    const totalRevenue = calculatePrice(allOrders);
    const revenuePerDay = totalRevenue / totalDaysNumber;
    const yesterdayRevenue = calculatePrice(yesterdayOrders);
    const revenuePercent = (
      (yesterdayRevenue / revenuePerDay - 1) *
      100
    ).toFixed(2);
    const compareRevenue = (yesterdayRevenue - revenuePerDay).toFixed(2);
    const compareOrderNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(
      2
    );

    res.status(200).json({
      revenue: {
        total: +totalRevenue,
        percent: Math.abs(+revenuePercent),
        compare: Math.abs(+compareRevenue),
        yesterday: +yesterdayRevenue,
        isHigher: revenuePercent > 0,
      },
      orders: {
        total: +totalOrdersNumber,
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareOrderNumber),
        yesterday: +yesterdayOrdersNumber,
        isHigher: ordersPercent > 0,
      },
    });
  } catch (err) {
    errorHandler(res, err);
  }
};

function getOrdersMap(orders = []) {
  const daysOrder = {};

  orders.forEach((order) => {
    const date = moment(order.date).format("DD.MM.YYYY");

    if (date === moment().format("DD.MM.YYYY")) {
      return;
    }

    if (!daysOrder[date]) {
      daysOrder[date] = [];
    }

    daysOrder[date].push(order);
  });

  return daysOrder;
}

function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return (orderTotal += item.cost * item.quantity);
    }, 0);
    return (total += orderPrice);
  }, 0);
}
