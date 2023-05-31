// đảm bảo không sử dụng các biến chưa khai báo
"use strict";

const express = require("express");
// khởi tạo ứng dụng web express
const app = express();
// tạo post cho web của mình bằng giá trị mặc định PORT của biến môi trường hoặc 5000
// khi triển khai lên web thực tế sẽ không biết port của họ là bao nhiên nên sử dụng biến môi trường mà họ cung cấp cho chúng ta nên có thể sử dụng port của riêng mình 5000
const port = process.env.PORT || 5000;
//
const expressHandlebars = require("express-handlebars");
const {createStarList} = require('./controllers/handlebarsHelper');
const {createPagination} = require('express-handlebars-paginate');
// cấu hình session
const session = require('express-session');


// cấu hình public static folder, trả về thư mục public cho người dùng khi truy cập web
app.use(express.static(__dirname + "/public"));

// cấu hình sử dụng express-handlebars
app.engine(
  "hbs",
  expressHandlebars.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs", // đuôi file
    defaultLayout: "layout",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        createStarList,
        createPagination
    }
  })
);

app.set("view engine", "hbs");

// cấu hình động dữ liệu post từ body
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// cấu hình sử dụng session
app.use(session({
  secret: 'S3cret', // khóa cho từng session lưu trữ
  resave: false, // không cập nhập session nếu không có sự thay đổi
  saveUninitialized: false, // không lưu những session chưa được khởi tạo
  cookie: { // quy định thời gian tồn tại của session
    httpOnly: true, // chỉ được truy cập thông qua http chứ ko thể truy cập do js mà mình viết lên
    maxAge: 20 * 60 * 1000, // 20 phút đổi ra ms 
  }
}));


// middle ware
app.use((req, res, next) => {
  let Cart = require('./controllers/cart');
  req.session.cart = new Cart(req.session.cart ? req.session.cart : {})
  res.locals.quantity = req.session.cart.quantity;
  

  next();
})
// routes, chuyển đến cho indexRouter xử lí
app.use("/", require("./routes/indexRouter"));
app.use("/products", require("./routes/productRouter"));
app.use('/users', require('./routes/usersRouter'));

// kiểm tra lỗi khi nhập sai link
app.use((req, res, next) => {
  res.status(404).render("error", { message: "File not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("error", {message: "Internal Server Error"});
});

// khởi động web server
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
