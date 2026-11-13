const express = require('express');
const cors = require('cors');

class ApiServer {
  constructor(blockchain, p2pServer) {
    this.blockchain = blockchain;
    this.p2pServer = p2pServer;
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());

    // 获取整条链
    this.app.get('/chain', (req, res) => {
      res.json(this.blockchain.chain);
    })
    // 获取peers数量
    this.app.get('/peers', (req, res) => {
      res.json({count: this.p2pServer.getPeersCount()})
    })
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`✅ API服务启动，监听端口 ${port}`);
    })
  }
}

module.exports = ApiServer;
