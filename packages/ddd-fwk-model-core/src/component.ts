/**
 * The symbol can be used to lookup component instances.
 */
export const ComponentSymbol = Symbol.for('fwk/Component');

/**
 * A component follows the lifecycle of a container.
 * It is a good place to configure event listeners making the glue with other bounded contexts.
 */
export abstract class Component {

  async configure(): Promise<void> {
  }

  async dispose(): Promise<void> {
  }

}
