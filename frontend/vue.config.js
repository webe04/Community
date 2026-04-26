const path = require('path')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  devServer: {
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:9090',
        changeOrigin: true
      }
    }
  },
})