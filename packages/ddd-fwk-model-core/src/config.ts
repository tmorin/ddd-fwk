/**
 * A configuration.
 */
export interface Config {
  [key: string]: any
}

/**
 * A scope is used to separate the config domains.
 */
export type ConfigScope = string | symbol

/**
 * The symbol can be used to lookup config provider instances.
 */
export const ConfigProviderSymbol = Symbol.for('fwk/ConfigProvider');

/**
 * Provide services to access and mutate to configurations.
 */
export interface ConfigProvider {

  /**
   * Get a set of configuration according to a scope.
   * @param scope the scope
   * @param defaultConfig returned when no config found for the given scope
   */
  get<C extends Config>(scope: ConfigScope, defaultConfig?: Partial<C>): C

  /**
   * Patch an existing scope.
   * @param scope the scope
   * @param config the config
   */
  patch<C extends Config>(scope: ConfigScope, config: Partial<C>): Promise<void>

}

