import {Event, EventListener, EventListenerOptions, listenEvents, PRIVATE_PROPERTY_EVENT_NAMES} from './event';

class EventA extends Event {
  constructor() {
    super(undefined, EventA.name);
  }
}

@listenEvents(EventA.name)
class EventAListener implements EventListener {
  async listen<EventA>(event?: EventA, options?: EventListenerOptions): Promise<void> {
  }
}

describe('event', function () {

  it('should flags handler with @listenEvents', function () {
    expect(EventAListener['prototype'][PRIVATE_PROPERTY_EVENT_NAMES]).toContainEqual(EventA.name);
    const queryAHandler = new EventAListener();
    expect(queryAHandler[PRIVATE_PROPERTY_EVENT_NAMES]).toContainEqual(EventA.name);
  });

})
