import {Container, EmptyResult, Query, QueryHandler} from '@tmorin/ddd-fwk-model-core';
import {LocalMessageBus} from '.';
import {ConsoleLoggerFactory} from '@tmorin/ddd-fwk-infra-logger-console';

class QueryA extends Query {
  constructor() {
    super(undefined, 'QueryA');
  }
}

class QueryAHandler extends QueryHandler<QueryA, EmptyResult> {
  async handle(query: QueryA): Promise<EmptyResult> {
    return EmptyResult.from(query);
  }
}

describe('LocalMessageBus/query', function () {

  it('should register and call query', async function () {
    const bus = new LocalMessageBus(new ConsoleLoggerFactory(new Container()));
    bus.registerQueryHandler(QueryA.name, new QueryAHandler());
    const resultA = await bus.call(new QueryA());
    expect(resultA.name).toEqual(QueryA.name);
  });

  it('should dispose', async function () {
    const bus = new LocalMessageBus(new ConsoleLoggerFactory(new Container()));
    bus.registerQueryHandler(QueryA.name, new QueryAHandler());
    await bus.dispose();
    await expect(bus.call(new QueryA())).rejects.toThrow('unable to found a query handler for (QueryA)')
  });

});
