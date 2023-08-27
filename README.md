# E-Shop
<a href="https://e-shop-ptudw-20120101.onrender.com"><b>Link Demo</b></a>

Bài tập môn phát triển ứng dụng web
<br>
Công nghệ được sử dụng: html, css, bootstrap, javascript, nodejs, express, express-handlebars và một vài thư viện bổ sung

Mô tả dự án
Đây là dự án xây dựng một trang web bán hàng quần áo với đầy đủ các chức năng cần thiết như: 
<ul>
  <li>Xem thông tin tổng quan và chi tiết của từng sản phẩm</li>
  <li>Đăng nhập, đăng kí tài khoản để thanh toán</li>
  <li>Thêm sản phẩm yêu thích vào giỏ hàng, cập nhập giỏ hàng nhanh chóng và thanh toán đơn hàng</li>
  <li>Chỉnh sửa các thông tin về cá nhân, địa chỉ giao hàng</li>
</ul>
Trang web sử dụng <b>PostgreSQL</b> để lưu trữ và xử lí dữ liệu
<br>
<br>
<br>
<h2>1. Dữ liệu của website</h2>
<br>
<img src="Database Diagram.png" style="width: 50%;">
Đây là bảng thiết kế database của trang web, dữ liệu sẽ được tạo ngẫu nhiên
<h2>2. Các chức năng chính</h2>
<br>
<img src="https://github.com/duquochuyy/E-Shop/assets/95600732/57fc7846-b1a3-4851-82fb-cca87732b131">
<br>
Trang chủ của website, ngoài ra còn có danh sách các sản phẩm có đánh giá cao nhất, danh sách các sản phẩm được xem gần đây
<br>
<br>
<br>
<img src="https://github.com/duquochuyy/E-Shop/assets/95600732/1eeb2751-e487-4d47-8023-aaf23a31638b">
<br>
Tìm kiếm sản phẩm theo tên hoặc mới nhất/ phổ biến/ giá. Bạn có thể tìm kiếm sản phẩm theo các tag hoặc category được có sẵn ở phần bên phải của trang web
<br>
<br>
<br>
<img src="https://github.com/duquochuyy/E-Shop/assets/95600732/70abf2ef-f6bd-4da3-9d67-71c5cb2a21c6">
<br>
Xem chi tiết sản phẩm, tại đây bạn có thể sản phẩm vào giỏ hàng với số lượng tùy chỉnh
<br>
<br>
<br>
<img src="https://github.com/duquochuyy/E-Shop/assets/95600732/66801136-cc89-4b05-814f-71feef860055">
<br>
Xem chi tiết giỏ hàng, tại đây bạn có thể cập nhập số lượng, xóa sản phẩm khỏi giỏ hàng, và khi hoàn tất có thể chuyển sang trang thanh toán
<br>
<br>
<br>
<img src="https://github.com/duquochuyy/E-Shop/assets/95600732/ff4ee698-366a-4741-9738-399a96cb70bb">
<br>
Để có thể thanh toán thì bắt buộc bạn phải có tài khoản và đây là trang đăng kí, đăng nhập cho trang web. Đừng lo giỏ hàng sẽ bị mất khi bạn đăng nhập, tôi sẽ lưu trữ thông tin giỏ hàng của bạn để đảm bảo chúng vẫn luôn ở đó.
<br>
<br>
<br>
<img src="https://github.com/duquochuyy/E-Shop/assets/95600732/96266862-504f-4403-8ff1-6068fdaa6d89">
<br>
Khi đăng nhập thành công, bạn sẽ được chuyển đến trang Dashboard, tại đây bạn có thể xem các thông tin cá nhân của mình như đơn hàng, địa chỉ đã từng lưu
<br>
<br>
<br>
<img src="https://github.com/duquochuyy/E-Shop/assets/95600732/f19c3fec-e9cd-405f-b1bc-0a326e1673fc">
<br>
Và bây giờ bạn có thể thanh toán dễ dàng sau khi điền địa chỉ (hoặc chọn nếu đã có từ trước), kiểm tra lại đơn hàng và chọn phương thanh toán. Nhấn <b>Place Order</b> để thanh toán
<br>
<br>
<br>
<img src="https://github.com/duquochuyy/E-Shop/assets/95600732/3906c869-b469-48d3-a5bc-e835963ffc4c">
<br>
Nếu có sự cần hỗ trợ nào, bạn có thể điền form để liên hệ với tôi
<br>
<br>
<br>

Trên đây là phần mô tả dự án, bạn có thể vào <a href="https://e-shop-ptudw-20120101.onrender.com/">Link Demo</a> để trải nghiệm thực tế nhất.








