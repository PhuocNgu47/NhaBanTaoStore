/**
 * Socket Handler
 * Xử lý WebSocket connections và events
 */

/**
 * Khởi tạo Socket.io handlers
 */
export const initializeSocket = (io) => {
  // Middleware để authenticate socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    // TODO: Verify JWT token
    // Nếu có token, verify và attach user info vào socket
    // Nếu không có token, vẫn cho phép kết nối nhưng không có user info
    
    next();
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // Join user room (nếu có user)
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join admin room (nếu là admin)
    if (socket.userRole === 'admin') {
      socket.join('admin');
    }

    // ============================================
    // ORDER EVENTS
    // ============================================

    // Client subscribe to order updates
    socket.on('subscribe:order', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} subscribed to order ${orderId}`);
    });

    // Client unsubscribe from order updates
    socket.on('unsubscribe:order', (orderId) => {
      socket.leave(`order:${orderId}`);
    });

    // ============================================
    // NOTIFICATION EVENTS
    // ============================================

    // Client mark notification as read
    socket.on('notification:read', (notificationId) => {
      // TODO: Update notification status in database
      socket.emit('notification:read:success', { id: notificationId });
    });

    // ============================================
    // DISCONNECT
    // ============================================

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Emit order status update to clients
 */
export const emitOrderStatusUpdate = (io, orderId, orderData) => {
  io.to(`order:${orderId}`).emit('order:status:update', {
    orderId,
    status: orderData.status,
    order: orderData
  });
};

/**
 * Emit notification to user
 */
export const emitNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification:new', notification);
};

/**
 * Emit notification to all admins
 */
export const emitAdminNotification = (io, notification) => {
  io.to('admin').emit('notification:new', notification);
};

