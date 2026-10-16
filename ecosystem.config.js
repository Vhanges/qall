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
        N8N_WEBHOOK_URL: "http://localhost:5678/webhook/qall",
        // Shared secret for the n8n webhook's Header Auth. Read from the server
        // environment at `pm2 start` so the value is never committed to git.
        // Set it on the host, e.g. in the deploy shell or an untracked env file:
        //   export QALL_WEBHOOK_API_KEY='<value matching the n8n credential>'
        QALL_WEBHOOK_API_KEY: process.env.QALL_WEBHOOK_API_KEY,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
