# Connection roadmap

## Implemented (initial code)
- Browser identification: Safari, Google Chrome, Firefox
- Injected MetaMask adapter with TWIX EVM network switch/add
- Keplr Cosmos adapter (optional chain suggestion info)
- Experimental injected Jupiter provider
- Node unit tests using mocked providers

## Not yet implemented
- EIP-6963 multi-provider discovery
- WalletConnect and official mobile deep links
- Official Solana wallet standard integration / Jupiter compatibility
- User interface and website embed widget
- Signed challenge authentication, secure backend session
- Real device tests on iOS and Android

Browser detection alone cannot access wallets installed in other mobile apps. Never ask for a recovery phrase.
