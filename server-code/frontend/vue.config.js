module.exports = {
  devServer: {
    proxy: {
      "/api/": {
        target: "http://0.0.0.0:3000",
        changeOrigin: true
      }
    }
  },
  
};