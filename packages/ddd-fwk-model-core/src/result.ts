import {Message, MessageId, MessageName, MessageType} from './message';
import {Command} from './command';
import {Query} from './query';

/**
 * An abstract implementation of result.
 */
export class Result<B = any> implements Message<B> {

  readonly type: MessageType = MessageType.result

  protected constructor(
    readonly body: B,
    readonly name: MessageName,
    readonly correlationId: MessageId,
    readonly messageId: MessageId = `${MessageType.result}-${Date.now()}`
  ) {
  }

  /**
   * Create a result from a query or a command.
   * @param message the query or command
   * @param body the body
   */
  static create<B = any>(message: Query | Command, body: B): Result<B> {
    return new Result(body, message.name, message.messageId);
  }

}

/**
 * An empty result.
 */
export class EmptyResult extends Result<void> {

  protected constructor(
    name: MessageName,
    correlationId: MessageId,
  ) {
    super(undefined, name, correlationId);
  }

  /**
   * Create an empty result from an existing query or command.
   * @param message the query or command
   * @return the result
   */
  static from(message: Query | Command): EmptyResult {
    return new EmptyResult(message.name, message.messageId);
  }

}
