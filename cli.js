const readline = require('readline');
const Blockchain = require("./Blockchain.js");
const P2p = require("./P2p.js");

// ✅ 正确加载，不是解构！
const blockchain = new Blockchain();
const p2p = new P2p(blockchain);

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
  const args = line.trim().split(' ');
  const cmd = args[0];

  switch(cmd) {
    case 'open':
      const port = parseInt(args[1]);
      p2p.listen(port);
      break;
    case 'connect':
      const peer = args[1];
      p2p.connectToPeer(peer);
      console.log(`尝试连接节点：${peer}`);
      break;
    case 'mine':
      const data = args.slice(1).join(' ');
      blockchain.mine(data);
      p2p.broadcastLatest();
      break;
    case 'chain':
      console.log(JSON.stringify(blockchain.get(), null, 2));
      break;
    case 'peers':
      console.log("当前连接节点数量：", p2p.sockets.length);
      break;
    case 'exit':
      rl.close();
      break;
    default:
      console.log("可用命令：open port | connect ws://xxx | mine text | chain | peers | exit");
  }
  rl.prompt();
});
