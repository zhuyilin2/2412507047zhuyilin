const Block = require('./Block');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  // 创世块
  createGenesisBlock() {
    return new Block(0, 1508270000000, "Genesis Block", "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // 挖矿
  mineBlock(data) {
    const lastBlock = this.getLastBlock();
    let newBlock = new Block(this.chain.length, Date.now(), data, lastBlock.hash);
    while (newBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
      newBlock.nonce++;
      newBlock.hash = newBlock.calculateHash();
    }
    this.chain.push(newBlock);
    return newBlock;
  }

  // 校验单个区块并尝试加入链
  addReceivedBlock(block) {
    const lastBlock = this.getLastBlock();
    // 校验前置hash
    if (block.previousHash !== lastBlock.hash) {
      return false;
    }
    // 校验难度
    if (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
      return false;
    }
    // 校验hash计算正确
    const testBlock = new Block(block.index, block.timestamp, block.data, block.previousHash, block.nonce);
    if (testBlock.hash !== block.hash) {
      return false;
    }
    this.chain.push(block);
    return true;
  }

  // 最长链替换共识
  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      return false;
    }
    if (!this.isChainValid(newChain)) {
      return false;
    }
    this.chain = newChain;
    return true;
  }

  isChainValid(chain = this.chain) {
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const prev = chain[i - 1];
      if (current.previousHash !== prev.hash) return false;
      const test = new Block(current.index, current.timestamp, current.data, current.previousHash, current.nonce);
      if (test.hash !== current.hash) return false;
    }
    return true;
  }
}

module.exports = Blockchain;
