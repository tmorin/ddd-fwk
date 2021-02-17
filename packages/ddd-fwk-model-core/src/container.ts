import {Module, ModuleConfiguration} from './module';
import {DefaultRegistry, Registry} from './registry';
import {MessageBus, MessageBusSymbol} from './bus';
import {LoggerFactory, LoggerFactorySymbol} from './logger';
import {ConfigProvider, ConfigProviderSymbol} from './config';
import {CommandHandler, CommandHandlerSymbol, CommandName, PRIVATE_PROPERTY_COMMAND_NAMES} from './command';
import {PRIVATE_PROPERTY_QUERY_NAMES, QueryHandler, QueryHandlerSymbol, QueryName} from './query';
import {EventListener, EventListenerSymbol, EventName, PRIVATE_PROPERTY_EVENT_NAMES} from './event';
import {Component, ComponentSymbol} from './component';

function assert(value: () => any) {
  try {
    value();
  } catch (e) {
    throw new Error(`the container configuration is not valid: ${e.message}`)
  }
}

export interface ContainerConfiguration extends ModuleConfiguration {
  name?: string,
  modules: Array<Module>
}

/**
 * The symbol can be used to lookup container instances.
 */
export const ContainerSymbol = Symbol.for('Container');

/**
 * A container implements the Dependency Injection pattern.
 */
export class Container {

  /**
   * The registry contains all managed objects.
   */
  public readonly registry: Registry;
  private readonly configuration: ContainerConfiguration;
  private readonly modules: Array<Module>;

  constructor(
    configuration: Partial<ContainerConfiguration> = {}
  ) {
    const name = configuration.name || `container-${Buffer.from(String(Date.now())).toString('base64')}`;
    const registry: Registry = configuration.registry || new DefaultRegistry();
    const modules: Array<Module> = configuration.modules || [];
    this.configuration = {...configuration, name, registry, modules};
    this.registry = this.configuration.registry;
    this.modules = this.configuration.modules;
  }

  /**
   * The name of the container.
   */
  get name() {
    return this.configuration.name
  }

  /**
   * The main message bus.
   */
  get messageBus() {
    return this.registry.resolve<MessageBus>(MessageBusSymbol);
  }

  /**
   * The main logger factory
   */
  get loggerFactory() {
    return this.registry.resolve<LoggerFactory>(LoggerFactorySymbol);
  }

  /**
   * The main config provider.
   */
  get configProvider() {
    return this.registry.resolve<ConfigProvider>(ConfigProviderSymbol);
  }

  /**
   * Initialize the container.
   *
   * 1. initialize the modules
   * 2. discover and register the command handlers
   * 3. discover and register the query handlers
   * 4. discover and register the event listeners
   * 5. discover and configure the components
   *
   * The initialization expects a main message bus, logger factory and config provider.
   *
   * @return the container it-self
   */
  async initialize(): Promise<this> {
    this.registry.registerValue(ContainerSymbol, this);

    for (const module of this.modules) {
      await module.initialize(this.configuration);
    }
    this.validateConfiguration();

    if (this.registry.contains(CommandHandlerSymbol)) {
      const commandHandlers = this.registry.resolveAll<CommandHandler>(CommandHandlerSymbol);
      for (const commandHandler of commandHandlers) {
        if (commandHandler[PRIVATE_PROPERTY_COMMAND_NAMES]) {
          const names: Array<CommandName> = commandHandler[PRIVATE_PROPERTY_COMMAND_NAMES];
          for (const name of names) {
            this.messageBus.registerCommandHandler(name, commandHandler);
          }
        }
      }
    }

    if (this.registry.contains(QueryHandlerSymbol)) {
      const queryHandlers = this.registry.resolveAll<QueryHandler>(QueryHandlerSymbol);
      for (const queryHandler of queryHandlers) {
        if (queryHandler[PRIVATE_PROPERTY_QUERY_NAMES]) {
          const names: Array<QueryName> = queryHandler[PRIVATE_PROPERTY_QUERY_NAMES];
          for (const name of names) {
            this.messageBus.registerQueryHandler(name, queryHandler);
          }
        }
      }
    }

    if (this.registry.contains(EventListenerSymbol)) {
      const eventListeners = this.registry.resolveAll<EventListener>(EventListenerSymbol);
      for (const eventListener of eventListeners) {
        if (eventListener[PRIVATE_PROPERTY_EVENT_NAMES]) {
          const names: Array<EventName> = eventListener[PRIVATE_PROPERTY_EVENT_NAMES];
          for (const name of names) {
            this.messageBus.on(name, eventListener.listen.bind(eventListener));
          }
        }
      }
    }

    if (this.registry.contains(ComponentSymbol)) {
      const components = this.registry.resolveAll<Component>(ComponentSymbol);
      for (const component of components) {
        await component.configure();
      }
    }

    return this;
  }

  /**
   * Clean a container instance.
   *
   * 1. dispose the components
   * 2. dispose the modules
   *
   * @return the container it-self
   */
  async dispose() {
    if (this.registry.contains(ComponentSymbol)) {
      const components = this.registry.resolveAll<Component>(ComponentSymbol);
      const reversedComponents = [...components].reverse();
      for (const component of reversedComponents) {
        await component.dispose();
      }
    }

    const reversedNodules = [...this.modules].reverse();
    for (const module of reversedNodules) {
      await module.dispose();
    }
  }

  private validateConfiguration() {
    assert(() => this.messageBus);
    assert(() => this.loggerFactory);
    assert(() => this.configProvider);
  }

}

/**
 * Builds a container instance.
 */
export class ContainerBuilder {

  constructor(
    private readonly _modules: Array<Module> = [],
    private _name: string = undefined,
    private _registry: Registry = new DefaultRegistry()
  ) {
  }

  /**
   * Get a fresh builder.
   */
  static create() {
    return new ContainerBuilder();
  }

  /**
   * Set a custom container name.
   * @param name the name
   * @return the builder
   */
  name(name: string) {
    this._name = name;
    return this;
  }

  /**
   * Set a custom registry.
   * @param registry the registry
   * @return the builder
   */
  registry(registry: Registry) {
    this._registry = registry;
    return this;
  }

  /**
   * Register modules.
   * @param modules the modules
   * @return the builder
   */
  module(...modules: Array<Module>) {
    for (const module of modules) {
      this._modules.push(module);
    }
    return this;
  }

  /**
   * Register an array of modules.
   * @param modules the modules
   * @return the builder
   */
  modules(modules: Array<Module>) {
    for (const module of modules) {
      this._modules.push(module);
    }
    return this;
  }

  /**
   * Build the container.
   * @return the container
   */
  build(): Container {
    return new Container({
      name: this._name,
      registry: this._registry,
      modules: this._modules
    })
  }

}
