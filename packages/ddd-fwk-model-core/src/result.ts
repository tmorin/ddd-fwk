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

  static create<B = any>(message: Query | Command, body: B): Result<B> {
    return new Result(body, message.name, message.messageId);
  }

}

export class EmptyResult extends Result<void> {

  protected constructor(
    name: MessageName,
    correlationId: MessageId,
  ) {
    super(undefined, name, correlationId);
  }

  static from(message: Query | Command): EmptyResult {
    return new EmptyResult(message.name, message.messageId);
  }

}
