# ddd-fwk

[![Integration](https://github.com/tmorin/ddd-fwk/workflows/Integration/badge.svg?branch=master)](https://github.com/tmorin/ddd-fwk/actions?query=workflow%3AIntegration+branch%3Amaster)

> A set of libraries helping to implement applications embracing the Domain Driven Design approach.

- [fwk-infra-bus-local](packages/ddd-fwk-infra-bus-local)
- [fwk-infra-config-inmemory](packages/ddd-fwk-infra-config-inmemory)
- [fwk-infra-logger-console](packages/ddd-fwk-infra-logger-console)
- [fwk-infra-test](packages/ddd-fwk-infra-test)
- [fwk-model-core](packages/ddd-fwk-model-core)
- [fwk-model-fs](packages/ddd-fwk-model-fs)
- [fwk-model-schema](packages/ddd-fwk-model-schema)
- [fwk-model-test](packages/ddd-fwk-model-test)

## Build

### Build and test

```shell script
npm ci
npm run bootstrap
npm run build
npm run jest
```
