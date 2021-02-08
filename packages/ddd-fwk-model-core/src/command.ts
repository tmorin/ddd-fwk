import {Message, MessageName, MessageType} from './message';
import {Event} from './event';
import {Result} from './result';

/**
 * An abstract implementation of a command.
 */
export abstract class Command<B = any> implements Message<B> {

  /* istanbul ignore next */
  protected constructor(
    readonly body: B,
    readonly name: MessageName,
    readonly type: MessageType = MessageType.command
  ) {
  }

}

/**
 * The name of a command.
 */
export type CommandName = MessageName;

/**
 * The symbol can be used to lookup command handler instances.
 */
export const CommandHandlerSymbol = Symbol.for('fwk/CommandHandler');

/**
 * A command handler hosts the handling logic for one or many commands.  
 */
export abstract class CommandHandler<C extends Command = Command, R extends Result = Result, E extends Event = Event> {

  /**
   * The implementation of the handler.
   * @param command the command
   * @return a tuple providing a result and a potential list of side effects
   */
  abstract handle(command: C): Promise<[R, Array<E>]>

}

/**
 * An helper method used by the typescript decorators.
 * @param names the names of handled commands.
 * @return the constructor
 */
export function handleCommands(...names: Array<CommandName>) {
  return (constructor: Function) => {
    constructor.prototype['__fwkHandledCommandNames'] = names;
  }
}
