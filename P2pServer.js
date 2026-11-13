const WebSocket = require('ws');

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.peers = [];
    this.server = null;
  }

  listen(port) {
    this.server = new WebSocket.Server({ port });
    this.server.on('connection', (ws) => {
      this.connectSocket(ws);
    });
    console.log(`Server is running on port ${port}`);
  }

  connectSocket(ws) {
    this.peers.push(ws);
    this.messageHandler(ws);
    ws.on('close', () => {
      this.peers = this.peers.filter(p => p !== ws);
    });
  }

  connectToPeer(address) {
    const ws = new WebSocket(address);
    ws.on('open', () => {
      this.connectSocket(ws);
      // 连上之后主动请求对方整条链
      ws.send(JSON.stringify({ type: 'REQUEST_CHAIN' }));
    });
    ws.on('error', (err) => {
      console.log("节点连接失败：", err.message);
    });
  }

  messageHandler(ws) {
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data);
        switch (msg.type) {
          case 'NEW_BLOCK':
            const ok = this.blockchain.addReceivedBlock(msg.block);
            if (ok) {
              console.log("\n✅ 收到广播新区块，已同步到本地");
            } else {
              console.log("\n❌ 新区块校验失败，拒绝");
            }
            break;
          case 'REQUEST_CHAIN':
            ws.send(JSON.stringify({
              type: 'CHAIN_RESPONSE',
              chain: this.blockchain.chain
            }));
            break;
          case 'CHAIN_RESPONSE':
            const replaced = this.blockchain.replaceChain(msg.chain);
            if (replaced) {
              console.log("\n✅ 收到远端链，本地链已被更长链替换");
            }
            break;
        }
      } catch (e) {
        // ignore bad message
      }
    });
  }

  // 广播新区块给所有peer
  broadcastNewBlock(block) {
    this.peers.forEach(peer => {
      if (peer.readyState === WebSocket.OPEN) {
        peer.send(JSON.stringify({
          type: 'NEW_BLOCK',
          block
        }));
      }
    });
  }

  getPeersCount() {
    return this.peers.filter(p => p.readyState === WebSocket.OPEN).length;
  }
}

module.exports = P2pServer;
