export type RegistryKey = string | symbol

/**
 * A registry is used to store things managed by a container.
 */
export interface Registry {

  /**
   * Register a new key/value entry.
   * @param key the key
   * @param value the value
   * @return the registry
   */
  registerValue(key: RegistryKey, value: any): this

  /**
   * Register a factory.
   * @param key the key
   * @param factory the value
   * @param options the options
   * @return the registry
   */
  registerFactory<T>(key: RegistryKey, factory: Factory<T>, options?: FactoryOptions): this

  /**
   * Resolve the first found entry matching a key.
   * @param key the key
   * @return the value
   */
  resolve<T>(key: RegistryKey): T

  /**
   * Resolve all entries matching a key.
   * @param key the key
   * @return the values
   */
  resolveAll<T>(key: RegistryKey): Array<T>

  /**
   * Checks if the key match an entry.
   * @param key the key
   * @return true when the key matches an existing entry.
   */
  contains(key: RegistryKey): boolean
}

/**
 * A factory.
 */
export interface Factory<T> {
  /**
   * Create a value.
   * @param registry a registry
   * @return the value
   */
  (registry: Registry): T
}

/**
 * An entry.
 */
interface Entry<T> {
  /**
   * Return an value.
   * @param registry a registry
   * @return the value
   */
  get(registry: Registry): T
}

/**
 * An entry of type value.
 */
class ValueEntry<T> implements Entry<T> {
  constructor(
    readonly value: T
  ) {
  }

  get(registry: Registry): T {
    return this.value
  }
}

/**
 * The factory options.
 */
export type FactoryOptions = {
  /**
   * When true, then the factory has to be only called once.
   */
  singleton?: boolean
}

/**
 * An entry of type factory.
 */
class FactoryEntry<T> implements Entry<T> {
  constructor(
    private readonly factory: Factory<T>,
    private readonly options: FactoryOptions = {},
    private value: T = undefined
  ) {
  }

  get(registry: Registry): T {
    if (this.options.singleton) {
      if (typeof this.value === 'undefined') {
        this.value = this.factory(registry)
      }
      return this.value;
    }
    return this.factory(registry);
  }
}

/**
 * The default implementation of a registry.
 */
export class DefaultRegistry implements Registry {

  constructor(
    private readonly entries = new Map<RegistryKey, Array<Entry<any>>>()
  ) {
  }

  registerValue(key: RegistryKey, value: any): this {
    if (!this.entries.has(key)) {
      this.entries.set(key, []);
    }
    this.entries.set(key, [new ValueEntry(value), ...this.entries.get(key)]);
    return this;
  }

  registerFactory<T>(key: RegistryKey, factory: Factory<T>, options: FactoryOptions = {}): this {
    if (!this.entries.has(key)) {
      this.entries.set(key, []);
    }
    this.entries.set(key, [new FactoryEntry(factory, options), ...this.entries.get(key)]);
    return this;
  }

  resolve<T>(key: RegistryKey): T {
    if (this.entries.has(key)) {
      return this.entries.get(key)[0].get(this);
    }

    throw new Error(`unable to resolve an entry with the key (${String(key)})`)
  }

  resolveAll<T>(key: RegistryKey): Array<T> {
    if (this.entries.has(key)) {
      return [...this.entries.get(key).map(entry => entry.get(this))];
    }
    throw new Error(`unable to resolve an entry with the key (${String(key)})`)
  }

  contains(key: RegistryKey): boolean {
    return this.entries.has(key);
  }

}
