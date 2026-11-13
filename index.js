const readline = require('readline');
const Blockchain = require('./Blockchain');
const P2pServer = require('./P2pServer');
const ApiServer = require('./ApiServer');

const bc = new Blockchain();
const p2p = new P2pServer(bc);
const api = new ApiServer(bc, p2p);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'blockchain>>>>> '
});

console.log("欢迎来到blockchain命令行界面");
console.log("Commands:");
console.log("  help [command...]  Provides help for a given command.");
console.log("  exit               Exits application.");
rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();
  if (!input) {
    rl.prompt();
    return;
  }
  const parts = input.split(/\s+/);
  const cmd = parts[0];

  switch (cmd) {
    case 'help':
      console.log("可用命令：open port | connect ws://xxx | mine text | chain | peers | api port | exit");
      break;
    case 'open':
      const port = parseInt(parts[1]);
      p2p.listen(port);
      break;
    case 'connect':
      const addr = parts[1];
      console.log(`尝试连接节点：${addr}`);
      p2p.connectToPeer(addr);
      break;
    case 'mine':
      const text = parts.slice(1).join(' ');
      const newBlock = bc.mineBlock(text);
      console.log("✅挖矿成功！新区块：", newBlock);
      p2p.broadcastNewBlock(newBlock);
      break;
    case 'chain':
      console.log(JSON.stringify(bc.chain, null, 2));
      break;
    case 'peers':
      console.log(`当前连接节点数量： ${p2p.getPeersCount()}`);
      break;
    case 'api':
      const apiPort = parseInt(parts[1]);
      api.start(apiPort);
      break;
    case 'exit':
      rl.close();
      process.exit(0);
      break;
    default:
      console.log("未知命令，输入help查看指令");
  }
  rl.prompt();
});
