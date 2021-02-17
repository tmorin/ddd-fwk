import {EmptyResult, Result} from './result';
import {Query} from './query';
import {Command} from './command';
import {MessageType} from './message';

export class QueryA extends Query {
  constructor() {
    super(undefined, QueryA.name);
  }
}

export class CommandA extends Command {
  constructor() {
    super(undefined, CommandA.name);
  }
}

describe('result', function () {
  it('should create a result', function () {
    const queryA = new QueryA();
    const result = Result.create<string>(queryA, 'the result');
    expect(result).toBeTruthy();
    expect(result.correlationId).toBe(queryA.messageId);
    expect(result.name).toBe(queryA.name);
    expect(result.type).toBe(MessageType.result);
    expect(result.body).toBe('the result');
  });
  it('should create an empty result', function () {
    const commandA = new CommandA();
    const result = EmptyResult.from(commandA);
    expect(result).toBeTruthy();
    expect(result.correlationId).toBe(commandA.messageId);
    expect(result.name).toBe(commandA.name);
    expect(result.type).toBe(MessageType.result);
  });
})
