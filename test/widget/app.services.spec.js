describe('Unit: contactUsPluginWidget: Services', function () {
    beforeEach(module('contactUsPluginWidget'));


  describe('Unit : Buildfire service', function () {
    var Buildfire;
    beforeEach(inject(
        function (_Buildfire_) {
          Buildfire = _Buildfire_;
        }));
    it('Buildfire should exists', function () {
      expect(Buildfire).toBeDefined();
    });
  });

  describe('Unit : DataStore Factory', function () {
    var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
    beforeEach(module('contactUsPluginWidget'));
    beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      DataStore = _DataStore_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      Buildfire = {
        datastore: {}
      };


    }));
  it('DataStore should exist and be an object', function () {
    expect(typeof DataStore).toEqual('object');
  });
  it('DataStore.get should exist and be a function', function () {
    expect(typeof DataStore.get).toEqual('function');
  });
  it('DataStore.getById should exist and be a function', function () {
    expect(typeof DataStore.getById).toEqual('function');
  });
  it('DataStore.insert should exist and be a function', function () {
    expect(typeof DataStore.insert).toEqual('function');
  });
  it('DataStore.update should exist and be a function', function () {
    expect(typeof DataStore.update).toEqual('function');
  });
  it('DataStore.save should exist and be a function', function () {
    expect(typeof DataStore.save).toEqual('function');
  });
  })

});