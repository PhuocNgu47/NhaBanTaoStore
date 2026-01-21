/**
 * PM2 Ecosystem Configuration
 * 
 * Cách sử dụng:
 * - Development: pm2 start ecosystem.config.js --env development
 * - Production: pm2 start ecosystem.config.js --env production
 * 
 * Lệnh khác:
 * - pm2 stop ecommerce-api
 * - pm2 restart ecommerce-api
 * - pm2 reload ecommerce-api (zero-downtime)
 * - pm2 logs ecommerce-api
 * - pm2 monit
 */

module.exports = {
  apps: [
    {
      name: 'ecommerce-api',
      script: './server.js',
      instances: process.env.NODE_ENV === 'production' ? 2 : 1, // 2 instances trong production
      exec_mode: process.env.NODE_ENV === 'production' ? 'cluster' : 'fork', // Cluster mode cho production
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto restart
      autorestart: true,
      watch: false, // Không watch trong production
      max_memory_restart: '1G', // Restart nếu memory > 1GB
      
      // Restart policy
      max_restarts: 10, // Tối đa 10 lần restart
      min_uptime: '10s', // Phải chạy ít nhất 10s mới tính là stable
      restart_delay: 4000, // Đợi 4s trước khi restart
      
      // Advanced
      kill_timeout: 5000, // Đợi 5s trước khi force kill
      listen_timeout: 10000, // Đợi 10s cho app khởi động
      shutdown_with_message: true,
      
      // Source map support (nếu dùng TypeScript)
      source_map_support: true,
      
      // Ignore watch
      ignore_watch: [
        'node_modules',
        'logs',
        'uploads',
        '.git'
      ]
    }
  ]
};

