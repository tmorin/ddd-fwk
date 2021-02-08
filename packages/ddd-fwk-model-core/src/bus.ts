import {Event, EventListenerCallback, EventName} from './event';
import {Command, CommandHandler, CommandName} from './command';
import {Query, QueryHandler, QueryName} from './query';
import {Result} from './result';

/**
 * The symbol can be used to lookup message bus instances.
 */
export const MessageBusSymbol = Symbol.for('fwk/MessageBus');

/**
 * The message bus is responsible to transfer messages.
 * It provides an API to send message and also to react on them.
 * 
 * It is a key component to implement the [Location Transparency](https://www.reactivemanifesto.org/glossary#Location-Transparency) pattern.
 */
export interface MessageBus {

  /**
   * Register a command handler.
   * @param name the name of the command
   * @param handler the handler
   */
  registerCommandHandler(name: CommandName, handler: CommandHandler): this

  /**
   * Execute a command.
   * @param command the command
   */
  execute<E extends Event = Event, R extends Result = Result, C extends Command = Command>(command: C): Promise<[R, Array<E>]>

  /**
   * Register a query handler.
   * @param name the name of the query
   * @param handler the handler
   */
  registerQueryHandler(name: QueryName, handler: QueryHandler): this

  /**
   * Call a query.
   * @param query the query
   */
  call<R extends Result = Result, Q extends Query = Query>(query: Q): Promise<R>

  /**
   * Publish events to the bus.
   * @param events the events
   */
  publish<E extends Event>(...events: Array<E>): Promise<void>

  /**
   * Listen and react on an event.
   * @param name the name of the event
   * @param listener the listener
   */
  on<E extends Event>(name: EventName, listener: EventListenerCallback<E>): this

  /**
   * Listen and react once on an event.
   * @param name the name of the event
   * @param listener the listener
   */
  once<E extends Event>(name: EventName, listener: EventListenerCallback<E>): this

  /**
   * Remove one or several listeners.
   * When the event name is set, it removes only the related listeners.
   * When the listener function is set, it removes only the related listener.
   * When both are empty , it removes all event listeners.
   * @param name an optional name
   * @param listener an optional listener
   */
  off<E extends Event>(name?: EventName, listener?: EventListenerCallback<E>): this

  /**
   * Unregister all commands, queries and remove all event listeners.
   */
  dispose(): Promise<void>
}
