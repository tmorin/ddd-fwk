import {Message, MessageName, MessageType} from './message';

/**
 * An abstract implementation of result.
 */
export abstract class Result<M = any> implements Message<M> {

  /* istanbul ignore next */
  protected constructor(
    readonly body: M,
    readonly name: MessageName,
    readonly type: MessageType = MessageType.result
  ) {
  }

}

/**
 * Provide the implementation of an "empty result", .i.e. when `void` is expected.
 */
export class EmptyResult extends Result<void> {
  /**
   * The result name.
   */
  public static readonly RESULT_NAME = Symbol.for(`fwk/${EmptyResult.name}`);

  /* istanbul ignore next */
  constructor() {
    super(undefined, EmptyResult.name)
  }

  /**
   * Create a empty result from scratch.
   * @return the empty result
   */
  static create() {
    return new EmptyResult();
  }
}
