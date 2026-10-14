export const TWIX_EVM = Object.freeze({chainId:'0x54574958',chainName:'TWIX Mainnet',nativeCurrency:{name:'TWIX',symbol:'TWIX',decimals:18},rpcUrls:['https://evm.twixchain.com'],blockExplorerUrls:['https://explorer.twixchain.com']});
export const TWIX_COSMOS = 'twix-1';
export function detectBrowser(ua = globalThis.navigator?.userAgent || '') {
  if (/Firefox|FxiOS/i.test(ua)) return 'firefox';
  if (/CriOS|Chrome/i.test(ua) && !/Chromium|Edg|OPR/i.test(ua)) return 'chrome';
  if (/Safari/i.test(ua) && !/Chrome|CriOS|Chromium|FxiOS|Edg|OPR/i.test(ua)) return 'safari';
  return 'other';
}
export function discoverWallets(scope = globalThis) {
  const eth = scope.ethereum;
  const providers = Array.isArray(eth?.providers) ? eth.providers : eth ? [eth] : [];
  return {browser:detectBrowser(scope.navigator?.userAgent),metamask:providers.find(p=>p?.isMetaMask && !p?.isBraveWallet)||null,keplr:scope.keplr||null,jupiter:scope.jupiter||scope.jup||null,evmProviders:providers};
}
export async function connectMetaMask({scope=globalThis,chain=TWIX_EVM}={}) {
  const wallet=discoverWallets(scope).metamask;
  if (!wallet?.request) throw new Error('MetaMask provider unavailable');
  const accounts=await wallet.request({method:'eth_requestAccounts'});
  if (!accounts?.[0]) throw new Error('No account authorised');
  try {await wallet.request({method:'wallet_switchEthereumChain',params:[{chainId:chain.chainId}]});}
  catch(error) {
    if(error?.code!==4902) throw error;
    await wallet.request({method:'wallet_addEthereumChain',params:[chain]});
    await wallet.request({method:'wallet_switchEthereumChain',params:[{chainId:chain.chainId}]});
  }
  return {wallet:'metamask',family:'evm',address:accounts[0],chainId:chain.chainId};
}
export async function connectKeplr({scope=globalThis,chainId=TWIX_COSMOS,chainInfo}={}) {
  const wallet=discoverWallets(scope).keplr;
  if(!wallet) throw new Error('Keplr provider unavailable');
  if(chainInfo) await wallet.experimentalSuggestChain(chainInfo);
  await wallet.enable(chainId);
  const key=await wallet.getKey(chainId);
  if(!key?.bech32Address) throw new Error('Keplr returned no address');
  return {wallet:'keplr',family:'cosmos',address:key.bech32Address,chainId};
}
export async function connectJupiter({scope=globalThis}={}) {
  const wallet=discoverWallets(scope).jupiter;
  if(!wallet?.connect) throw new Error('Jupiter injected provider unavailable');
  const result=await wallet.connect();
  const address=result?.publicKey?.toString()||wallet.publicKey?.toString();
  if(!address) throw new Error('No Solana public key returned');
  return {wallet:'jupiter',family:'solana',address};
}
export async function connectWallet(kind,options={}) {
  switch(kind) {
    case 'metamask':return connectMetaMask(options);
    case 'keplr':return connectKeplr(options);
    case 'jupiter':return connectJupiter(options);
    default:throw new Error('Unsupported wallet: '+kind);
  }
}
