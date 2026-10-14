import test from 'node:test';
import assert from 'node:assert/strict';
import {detectBrowser,discoverWallets,connectMetaMask,connectKeplr,connectJupiter} from '../src/index.js';
test('detects Safari, Chrome and Firefox, not Chromium',()=>{
 assert.equal(detectBrowser('Mozilla Safari/605.1'),'safari');
 assert.equal(detectBrowser('Mozilla Chrome/125 Safari/537'),'chrome');
 assert.equal(detectBrowser('Mozilla Firefox/125'),'firefox');
 assert.equal(detectBrowser('Mozilla Chromium/125'),'other');
});
test('discovers injected wallet',()=>{const p={isMetaMask:true};assert.equal(discoverWallets({ethereum:p}).metamask,p);});
test('connects MetaMask and switches network',async()=>{
 const calls=[];const scope={ethereum:{isMetaMask:true,async request({method}){calls.push(method);return method==='eth_requestAccounts'?['0xabc']:null;}}};
 assert.equal((await connectMetaMask({scope})).address,'0xabc');
 assert.deepEqual(calls,['eth_requestAccounts','wallet_switchEthereumChain']);
});
test('connects Keplr',async()=>{
 const scope={keplr:{async enable(id){assert.equal(id,'twix-1');},async getKey(){return {bech32Address:'twix1test'};}}};
 assert.equal((await connectKeplr({scope})).address,'twix1test');
});
test('connects experimental Jupiter provider',async()=>{
 const scope={jupiter:{async connect(){return {publicKey:{toString:()=> 'solAddress'}};}}};
 assert.equal((await connectJupiter({scope})).address,'solAddress');
});
