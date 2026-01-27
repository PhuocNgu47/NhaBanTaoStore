/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FILE: docs/swagger.js - Tài liệu Swagger cho tất cả API endpoints
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * File này chứa tất cả Swagger documentation cho các routes
 * Được import trong server.js để tạo trang API docs
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🔐 AUTHENTICATION - Đăng nhập, đăng ký
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: API đăng nhập, đăng ký, quản lý tài khoản
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa được xác thực
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📦 PRODUCTS - Quản lý sản phẩm
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: API quản lý sản phẩm (bán hàng, tìm kiếm, lọc)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang (phân trang)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số sản phẩm trên 1 trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên sản phẩm
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       image:
 *                         type: string
 *                       description:
 *                         type: string
 *                 total:
 *                   type: integer
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 *       404:
 *         description: Sản phẩm không tồn tại
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Tạo sản phẩm mới (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               price:
 *                 type: number
 *                 example: 999
 *               category:
 *                 type: string
 *                 example: Smartphones
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       401:
 *         description: Chưa xác thực / Không phải admin
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Sản phẩm không tồn tại
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       404:
 *         description: Sản phẩm không tồn tại
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🛒 CART - Giỏ hàng
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: API quản lý giỏ hàng
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Lấy giỏ hàng của người dùng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Giỏ hàng của người dùng
 *       401:
 *         description: Chưa xác thực
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Thêm vào giỏ hàng thành công
 */

/**
 * @swagger
 * /cart/remove/{productId}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa khỏi giỏ hàng thành công
 */

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Xóa toàn bộ giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa toàn bộ giỏ hàng thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// ❤️ WISHLIST - Danh sách yêu thích
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Wishlist
 *     description: API quản lý danh sách yêu thích
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Lấy danh sách yêu thích của người dùng
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách yêu thích
 */

/**
 * @swagger
 * /wishlist/add:
 *   post:
 *     summary: Thêm sản phẩm vào danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm vào danh sách yêu thích thành công
 */

/**
 * @swagger
 * /wishlist/remove/{productId}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa khỏi danh sách yêu thích thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📋 ORDERS - Đơn hàng
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: API quản lý đơn hàng
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng của người dùng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *         description: Lọc theo trạng thái đơn hàng
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
 *       404:
 *         description: Đơn hàng không tồn tại
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   phone:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, bank_transfer]
 *               couponCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Hủy đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hủy đơn hàng thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// 💳 PAYMENT - Thanh toán
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: API xử lý thanh toán (COD, chuyển khoản)
 */

/**
 * @swagger
 * /payment/cod:
 *   post:
 *     summary: Thanh toán khi nhận hàng (COD)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác nhận thanh toán COD thành công
 */

/**
 * @swagger
 * /payment/bank-transfer:
 *   post:
 *     summary: Thanh toán bằng chuyển khoản ngân hàng
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - amount
 *             properties:
 *               orderId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tạo mã QR thanh toán thành công
 */

/**
 * @swagger
 * /payment/verify:
 *   post:
 *     summary: Xác nhận thanh toán
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - transactionId
 *             properties:
 *               orderId:
 *                 type: string
 *               transactionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác nhận thanh toán thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// ⭐ REVIEWS - Đánh giá sản phẩm
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: API quản lý đánh giá sản phẩm
 */

/**
 * @swagger
 * /reviews/product/{productId}:
 *   get:
 *     summary: Lấy danh sách đánh giá của sản phẩm
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Tạo đánh giá sản phẩm
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Xóa đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa đánh giá thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// 👤 USERS - Quản lý người dùng
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API quản lý thông tin người dùng
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin hồ sơ
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Cập nhật thông tin hồ sơ
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📍 ADDRESSES - Quản lý địa chỉ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Addresses
 *     description: API quản lý địa chỉ giao hàng
 */

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Lấy danh sách địa chỉ của người dùng
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách địa chỉ
 */

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Thêm địa chỉ mới
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - province
 *               - phone
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               phone:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Thêm địa chỉ thành công
 */

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Cập nhật địa chỉ
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Xóa địa chỉ
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa địa chỉ thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🎟️ COUPONS - Mã giảm giá
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Coupons
 *     description: API quản lý mã giảm giá / voucher
 */

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Lấy danh sách mã giảm giá
 *     tags: [Coupons]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Chỉ lấy mã còn hiệu lực
 *     responses:
 *       200:
 *         description: Danh sách mã giảm giá
 */

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     summary: Kiểm tra mã giảm giá có hợp lệ không
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - totalAmount
 *             properties:
 *               code:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Mã giảm giá hợp lệ
 *       400:
 *         description: Mã giảm giá không hợp lệ

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Tạo mã giảm giá (Admin)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountPercent
 *               - maxUses
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER2024
 *               discountPercent:
 *                 type: number
 *                 example: 10
 *               maxUses:
 *                 type: integer
 *               minAmount:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tạo mã giảm giá thành công

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Xóa mã giảm giá (Admin)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa mã giảm giá thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🏷️ CATEGORIES - Danh mục sản phẩm
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: API quản lý danh mục sản phẩm (3 cấp)
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách danh mục
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tạo danh mục (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật danh mục thành công
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Xóa danh mục (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🇻🇳 VIETNAM ADDRESS - API Địa chỉ Việt Nam
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Vietnam Address
 *     description: API dữ liệu tỉnh/thành phố, quận/huyện, phường/xã của Việt Nam
 */

/**
 * @swagger
 * /vietnam-address/provinces:
 *   get:
 *     summary: Lấy danh sách tỉnh/thành phố
 *     tags: [Vietnam Address]
 *     responses:
 *       200:
 *         description: Danh sách tỉnh/thành phố
 */

/**
 * @swagger
 * /vietnam-address/districts/{provinceCode}:
 *   get:
 *     summary: Lấy danh sách quận/huyện theo tỉnh
 *     tags: [Vietnam Address]
 *     parameters:
 *       - in: path
 *         name: provinceCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã tỉnh/thành phố
 *     responses:
 *       200:
 *         description: Danh sách quận/huyện
 */

/**
 * @swagger
 * /vietnam-address/wards/{districtCode}:
 *   get:
 *     summary: Lấy danh sách phường/xã theo quận/huyện
 *     tags: [Vietnam Address]
 *     parameters:
 *       - in: path
 *         name: districtCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã quận/huyện
 *     responses:
 *       200:
 *         description: Danh sách phường/xã
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📊 STATISTICS - Thống kê (Admin)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Statistics
 *     description: API thống kê (Chỉ Admin)
 */

/**
 * @swagger
 * /statistics/dashboard:
 *   get:
 *     summary: Lấy thông tin dashboard
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin dashboard (tổng doanh thu, số đơn, ...)
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không phải admin
 */

/**
 * @swagger
 * /statistics/revenue:
 *   get:
 *     summary: Thống kê doanh thu theo kỳ
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *         description: Kỳ thống kê
 *     responses:
 *       200:
 *         description: Dữ liệu doanh thu
 */

/**
 * @swagger
 * /statistics/orders:
 *   get:
 *     summary: Thống kê số lượng đơn hàng
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái đơn hàng
 *     responses:
 *       200:
 *         description: Thống kê đơn hàng
 */

/**
 * @swagger
 * /statistics/top-products:
 *   get:
 *     summary: Sản phẩm bán chạy nhất
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số sản phẩm trả về
 *     responses:
 *       200:
 *         description: Top sản phẩm bán chạy
 */

/**
 * @swagger
 * /statistics/users:
 *   get:
 *     summary: Thống kê người dùng
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê người dùng (tổng, mới, ...)
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🔒 SECURITY - Cấu hình bảo mật
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token từ login endpoint
 */

export default {};