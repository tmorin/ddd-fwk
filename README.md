# p2p-fwk

[![Integration](https://github.com/tmorin/p2p-fwk/workflows/Integration/badge.svg?branch=master)](https://github.com/tmorin/p2p-fwk/actions?query=workflow%3AIntegration+branch%3Amaster)

> A set of libraries helping to implement p2p applications.

- [fwk-infra-bus-local](packages/p2p-fwk-infra-bus-local)
- [fwk-infra-config-inmemory](packages/p2p-fwk-infra-config-inmemory)
- [fwk-infra-logger-console](packages/p2p-fwk-infra-logger-console)
- [fwk-infra-test](packages/p2p-fwk-infra-test)
- [fwk-model-core](packages/p2p-fwk-model-core)
- [fwk-model-test](packages/p2p-fwk-model-test)

## Build

### Build and test

```shell script
npm ci
npm run bootstrap
npm run build
npm run jest
```
