module.exports = {
  apps: [{
    name: 'crbs-backend',
    script: 'src/app.js',
    instances: 1,
    autorestart: true,
    watch: ['src'],
    watch_delay: 1000,
    ignore_watch: ['node_modules'],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
    },
  }],
};
