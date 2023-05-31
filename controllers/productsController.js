"use strict";

let controller = {};
const models = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

controller.getData = async (req, res, next) => {
  // xử lí phần category
  let categories = await models.Category.findAll({
    include: [
      {
        model: models.Product,
      },
    ],
  });
  res.locals.categories = categories;

  // xử lí phần brand
  let brands = await models.Brand.findAll({
    include: [
      {
        model: models.Product,
      },
    ],
  });
  res.locals.brands = brands;

  // xử lí phần tag
  let tags = await models.Tag.findAll();
  res.locals.tags = tags;

  next();
};

controller.show = async (req, res) => {
  let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
  let brand = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
  let tag = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
  let keyword = req.query.keyword || "";
  // lấy giá trị sort, cần đúng thể loại sort nếu không sẽ mặc định sort theo giá
  let sort = ["price", "newest", "popular"].includes(req.query.sort)
    ? req.query.sort
    : "price";
  let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));

  // product hiển thị theo tag, brand hoặc category
  let options = {
    attributes: ["id", "name", "imagePath", "stars", "price", "oldPrice"],
    where: {},
  };
  if (category > 0) {
    options.where.categoryId = category;
  }
  if (brand > 0) {
    options.where.brandId = brand;
  }
  if (tag > 0) {
    options.include = [
      {
        model: models.Tag,
        where: { id: tag },
      },
    ];
  }

  // xu li search
  if (keyword.trim() != "") {
    options.where.name = {
      // select * from products where name like '%abc%'
      [Op.iLike]: `%${keyword}%`,
    };
  }

  // xu li phan sort
  switch (sort) {
    case "newest":
      options.order = [["createdAt", "DESC"]];
      break;
    case "popular":
      options.order = [["stars", "DESC"]];
      break;
    default:
      options.order = [["price", "ASC"]];
  }

  // xu li viec sort theo category, giữ nguyên url cũ và thêm phần sort vào, xử lí việc duplicate tham số trên đường link
  res.locals.sort = sort;
  res.locals.originalUrl = removeParam("sort", req.originalUrl);
  if (Object.keys(req.query).length == 0) {
    res.locals.originalUrl = res.locals.originalUrl + "?";
  }

  // cài đặt phân trnag ở paginition
  const limit = 6;
  // 0->5, 6->11
  options.limit = limit;
  options.offset = limit * (page - 1);

  // rows: danh sách các sản phẩm thõa điều kiện, count là có bao nhiêu sản phẩm thõa
  let { rows, count } = await models.Product.findAndCountAll(options);

  res.locals.pagination = {
    page: page,
    limit: limit,
    totalRows: count,
    queryParams: req.query,
  };

  // xử lí phần hiển thị product
  // let products = await models.Product.findAll(options);
  res.locals.products = rows;
  res.render("product-list");
};

controller.showDetails = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  let product = await models.Product.findOne({
    attributes: [
      "id",
      "name",
      "stars",
      "oldPrice",
      "price",
      "summary",
      "description",
      "specification",
    ],
    where: { id },
    include: [
      {
        model: models.Image,
        attributes: ["name", "imagePath"],
      },
      {
        model: models.Review,
        attributes: ["review", "stars", "id", "createdAt"],
        include: [
          {
            model: models.User,
            atttributes: ["firstName", "lastName"],
          },
        ],
      },
      {
        model: models.Tag,
        attributes: ["id"],
      },
    ],
  });
  res.locals.product = product;

  // lấy ra những sản phẩm liên quan
  let tagIds = [];
  product.Tags.forEach(tag => tagIds.push(tag.id))
  let relatedProducts = await models.Product.findAll({
    attributes: ['id', 'name', 'imagePath', 'oldPrice', 'price'],
    include: [{
      model: models.Tag,
      attributes: ['id'],
      where: {
        id: {[Op.in]: tagIds}
      }
    }],
    limit: 10
  });
  res.locals.relatedProducts = relatedProducts;

  res.render("product-detail");
};

function removeParam(key, sourceURL) {
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
  }
  return rtn;
}

module.exports = controller;
