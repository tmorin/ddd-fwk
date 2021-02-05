import {EmptyResult} from './result';

describe('result', function () {

  it('should creates empty result', function () {
    expect(EmptyResult.create()).toBeTruthy();
  });

})
