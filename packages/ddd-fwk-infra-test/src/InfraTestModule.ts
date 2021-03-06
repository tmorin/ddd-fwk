import {
  AbstractModule,
  ConfigProvider,
  ConfigProviderSymbol,
  Container,
  ContainerSymbol,
  LoggerFactory,
  LoggerFactorySymbol,
  MessageBus,
  MessageBusSymbol
} from '@tmorin/ddd-fwk-model-core';
import {InMemoryConfigProvider} from '@tmorin/ddd-fwk-infra-config-inmemory';
import {LocalMessageBus} from '@tmorin/ddd-fwk-infra-bus-local';
import {ConsoleLoggerFactory} from '@tmorin/ddd-fwk-infra-logger-console';
import {ConfigsTestProviderSymbol, DefaultConfigsTestProvider} from '@tmorin/ddd-fwk-model-test';

export class InfraTestModule extends AbstractModule {

  async configure(): Promise<void> {

    this.registry.registerFactory<ConfigProvider>(ConfigProviderSymbol, () => new InMemoryConfigProvider(), {singleton: true});

    this.registry.registerFactory<LoggerFactory>(LoggerFactorySymbol, registry => new ConsoleLoggerFactory(
      registry.resolve<Container>(ContainerSymbol)
    ), {singleton: true});

    this.registry.registerFactory<MessageBus>(MessageBusSymbol, registry => new LocalMessageBus(
      registry.resolve<LoggerFactory>(LoggerFactorySymbol)
    ), {singleton: true});

    this.registry.registerValue(ConfigsTestProviderSymbol, new DefaultConfigsTestProvider())
  }

  async dispose(): Promise<void> {
    await this.registry.resolve<MessageBus>(MessageBusSymbol).dispose();
  }
}
