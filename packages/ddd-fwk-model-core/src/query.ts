import {Message, MessageId, MessageName, MessageType} from './message';
import {Result} from './result';

/**
 * An abstract implementation of a query.
 */
export abstract class Query<M = any> implements Message<M> {

  readonly type: MessageType = MessageType.query

  /* istanbul ignore next */
  protected constructor(
    readonly body: M,
    readonly name: MessageName,
    readonly messageId: MessageId = `${MessageType.query}-${Date.now()}`
  ) {
  }

}

/**
 * The name of a query.
 */
export type QueryName = MessageName;

/**
 * The symbol can be used to lookup query handler instances.
 */
export const QueryHandlerSymbol = Symbol.for('fwk/QueryHandler');

/**
 * A query handler hosts the handling logic for one or many queries.
 */
export abstract class QueryHandler<Q extends Query = Query, R extends Result = Result> {

  /**
   * The implementation of the handler.
   * @param query the query
   * @return the result
   */
  abstract handle(query: Q): Promise<R>

}

/**
 * An helper method used by the typescript decorators.
 * @param names the names of handled queries.
 * @return the constructor
 */
export function handleQueries(...names: Array<QueryName>) {
  return (constructor: Function) => {
    constructor.prototype[PRIVATE_PROPERTY_QUERY_NAMES] = names;
  }
}

/**
 * @private
 */
export const PRIVATE_PROPERTY_QUERY_NAMES = '__fwkHandledQueryNames';
