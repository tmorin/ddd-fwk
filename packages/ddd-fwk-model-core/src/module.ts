import {MessageBus, MessageBusSymbol} from './bus';
import {LoggerFactory, LoggerFactorySymbol} from './logger';
import {ConfigProvider, ConfigProviderSymbol} from './config';
import {Registry} from './registry';

/**
 * The available configuration of a module.
 */
export interface ModuleConfiguration {
  /**
   * The registry.
   */
  registry: Registry
}

/**
 * From a DDD point of view, a module is either a module or a bounded contexts.
 * A module follows the lifecycle of the container.
 */
export interface Module {

  /**
   * Initialize the module.
   * @param configuration the configuration
   */
  initialize(configuration: ModuleConfiguration): Promise<void>

  /**
   * Dispose the module.
   */
  dispose(): Promise<void>

}

/**
 * A configurable module is module not yet configured by a container.
 * Therefore, its configuration can still be adapted.
 */
export interface ConfigurableModule {
  /**
   * The registry.
   */
  registry: Registry

  /**
   * Set a message bus.
   * @param messageBus the message bus
   */
  setMessageBus(messageBus: MessageBus): this

  /**
   * Set a logger factory.
   * @param loggerFactory the logger factory
   */
  setLoggerFactory(loggerFactory: LoggerFactory): this

  /**
   * Set a message bus.
   * @param configProvider the config provider
   */
  setConfigProvider(configProvider: ConfigProvider): this

  /**
   * Provide the configuration of the module.
   */
  configure(this: ConfigurableModule): Promise<void>
}

/**
 * This abstract implementation is used to helps the configuration of modules.
 */
export abstract class AbstractModule implements Module, ConfigurableModule {

  private configuration: ModuleConfiguration

  get registry(): Registry {
    return this.configuration.registry;
  }

  async initialize(configuration: ModuleConfiguration): Promise<void> {
    this.configuration = configuration;
    await this.configure();
  }

  abstract configure(this: ConfigurableModule): Promise<void>

  async dispose(): Promise<void> {
  }

  async getConfiguration(): Promise<ModuleConfiguration> {
    return {
      registry: this.configuration.registry
    }
  }

  setMessageBus(messageBus: MessageBus): this {
    this.registry.registerValue(MessageBusSymbol, messageBus);
    return this;
  }

  setLoggerFactory(loggerFactory: LoggerFactory): this {
    this.registry.registerValue(LoggerFactorySymbol, loggerFactory);
    return this;
  }

  setConfigProvider(configProvider: ConfigProvider): this {
    this.registry.registerValue(ConfigProviderSymbol, configProvider);
    return this;
  }

}

/**
 * An help class to define module using an "inline" approach.
 */
export class OnlyConfigureModule extends AbstractModule {
  constructor(private readonly _configure: (this: ConfigurableModule) => Promise<void>) {
    super();
  }

  /**
   * Create a fresh module from a lambda.
   * @param cb the lambda to configure the module
   * @return the fresh module
   */
  static create(cb: (this: ConfigurableModule) => Promise<void>) {
    return new OnlyConfigureModule(cb);
  }
  
  async configure(): Promise<void> {
    await this._configure.apply(this)
  }
}
