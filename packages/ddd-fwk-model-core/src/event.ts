import {Message, MessageId, MessageName, MessageType} from './message';

/**
 * An abstract implementation of an event.
 */
export abstract class Event<B = any> implements Message<B> {

  readonly type: MessageType = MessageType.event

  /* istanbul ignore next */
  protected constructor(
    readonly body: B,
    readonly name: MessageName,
    readonly messageId: MessageId = `${MessageType.event}-${Date.now()}`
  ) {
  }

}

/**
 * Signature of the callback of an event listener.
 */
export interface EventListenerCallback<E extends Event = Event> {
  /**
   * Callback of an event listener.
   * @param event the event
   */
  (event?: E): void
}

/**
 * The available options of an event lister.
 */
export type EventListenerOptions = {
  /**
   * when true, the listener will listen the event only once.
   */
  once: boolean
}

/**
 * The name of an event.
 */
export type EventName = MessageName

/**
 * The symbol can be used to lookup event listener instances.
 */
export const EventListenerSymbol = Symbol.for('fwk/EventListener');

/**
 * An event listener hosts the listener logic for one or many events.
 */
export abstract class EventListener {

  /**
   * The implementation of the listener.
   * @param event the event
   * @param options the options
   */
  abstract listen<E extends Event>(event?: E, options?: EventListenerOptions): Promise<void>

}

/**
 * An helper method used by the typescript decorators.
 * @param names the names of handled events.
 * @return the constructor
 */
export function listenEvents(...names: Array<EventName>) {
  return (constructor: Function) => {
    constructor.prototype[PRIVATE_PROPERTY_EVENT_NAMES] = names;
  }
}

/**
 * @private
 */
export const PRIVATE_PROPERTY_EVENT_NAMES = '__fwkHandledEventNames';
