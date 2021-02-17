import {handleQueries, PRIVATE_PROPERTY_QUERY_NAMES, Query, QueryHandler} from './query';
import {EmptyResult} from './result';

class QueryA extends Query {
  constructor() {
    super(undefined, QueryA.name);
  }
}

@handleQueries(QueryA.name)
class QueryAHandler implements QueryHandler<QueryA, EmptyResult> {
  async handle(query: QueryA): Promise<EmptyResult> {
    return EmptyResult.from(query);
  }
}

describe('query', function () {

  it('should flags handler with @handleQueries', function () {
    expect(QueryAHandler['prototype'][PRIVATE_PROPERTY_QUERY_NAMES]).toContainEqual(QueryA.name);
    const queryAHandler = new QueryAHandler();
    expect(queryAHandler[PRIVATE_PROPERTY_QUERY_NAMES]).toContainEqual(QueryA.name);
  });

})
