/**
 * Create loggers.
 */
export interface LoggerFactory {

  /**
   * Create a logger.
   * @param names a set of names
   * @return the created logger
   */
  create(...names: Array<string>): Logger

}

/**
 * The symbol can be used to lookup logger factory instances.
 */
export const LoggerFactorySymbol = Symbol.for('fwk/LoggerFactory');

/**
 * A logger display messages for technical purpose.
 */
export interface Logger {

  /**
   * Append a debug message.
   * @param message the message
   * @param optionalParams the optional parameters
   */
  debug(message?: any, ...optionalParams: any[]): void

  /**
   * Append a log message.
   * @param message the message
   * @param optionalParams the optional parameters
   */
  log(message?: any, ...optionalParams: any[]): void

  /**
   * Append an info message.
   * @param message the message
   * @param optionalParams the optional parameters
   */
  info(message?: any, ...optionalParams: any[]): void

  /**
   * Append a debug message.
   * @param message the message
   * @param optionalParams the optional parameters
   */
  warn(message?: any, ...optionalParams: any[]): void

  /**
   * Append an error message.
   * @param message the message
   * @param optionalParams the optional parameters
   */
  error(message?: any, ...optionalParams: any[]): void

}
