<template>
  <div class="container">
    <h2>区块链浏览器</h2>
    <div style="margin-bottom:20px;">
      <label>节点API地址：</label>
      <input v-model="apiUrl" style="width:300px;padding:4px"/>
      <button @click="fetchChain">刷新链数据</button>
    </div>
    <div v-for="block in chain" :key="block.index" class="block">
      <h4>区块 index: {{block.index}}</h4>
      <p>时间戳：{{block.timestamp}}</p>
      <p>数据：{{block.data}}</p>
      <p>PreviousHash：{{block.previousHash}}</p>
      <p>Hash：{{block.hash}}</p>
      <p>Nonce：{{block.nonce}}</p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const apiUrl = ref("http://127.0.0.1:3001/chain")
const chain = ref([])

async function fetchChain(){
  const res = await fetch(apiUrl.value)
  chain.value = await res.json()
}
fetchChain()
</script>
<style>
.container{padding:20px;max-width:1200px;margin:0 auto;}
.block{border:1px solid #333;padding:16px;margin:10px 0;border-radius:8px;}
</style>
