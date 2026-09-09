module.exports = {
  apps: [
    {
      name: "qall",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/qall",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
