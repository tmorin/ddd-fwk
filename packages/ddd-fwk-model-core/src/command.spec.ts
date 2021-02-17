import {Command, CommandHandler, handleCommands, PRIVATE_PROPERTY_COMMAND_NAMES} from './command';
import {Event} from './event';
import {EmptyResult} from './result';

class CommandA extends Command {
  constructor() {
    super(undefined, CommandA.name);
  }
}

class EventA extends Event {
  constructor() {
    super(undefined, EventA.name);
  }
}

@handleCommands(CommandA.name)
class CommandAHandler implements CommandHandler<CommandA, EmptyResult> {
  async handle(command: CommandA): Promise<[EmptyResult, Array<EventA>]> {
    return [EmptyResult.from(command), [new EventA()]];
  }
}

describe('command', function () {

  it('should flags handler with @handleCommands', function () {
    expect(CommandAHandler['prototype'][PRIVATE_PROPERTY_COMMAND_NAMES]).toContainEqual(CommandA.name);
    const commandAHandler = new CommandAHandler();
    expect(commandAHandler[PRIVATE_PROPERTY_COMMAND_NAMES]).toContainEqual(CommandA.name);
  });

})
