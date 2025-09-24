module.exports = {
  apps: [{
    name: 'taleskillz',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/taleskillz.com',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
