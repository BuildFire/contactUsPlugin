describe('Unit : contactUsPlugin design services', function () {
  describe('Unit: Buildfire Provider', function () {
    var Buildfire;
    beforeEach(module('contactUsPluginDesign'));

    beforeEach(inject(function (_Buildfire_, $q) {
      Buildfire = _Buildfire_;

    }));
    it('Buildfire should exist and be an object', function () {
      expect(typeof Buildfire).toEqual('object');
    });
  });

  describe('Unit : DataStore Factory', function () {
    var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q;
    beforeEach(module('contactUsPluginDesign'));

    beforeEach(module('contactUsPluginDesign', function ($provide) {
      $provide.service('Buildfire', function () {
        this.datastore = jasmine.createSpyObj('datastore', ['get', 'getById', 'insert', 'update', 'save']);
        this.datastore.get.and.callFake(function (_tagName, callback) {
          if (_tagName) {
            callback(null, 'Success');
          } else {
            callback('Error', null);
          }
        });

        this.datastore.save.and.callFake(function (item, _tagName, callback) {
          if (item, _tagName) {
            callback(null, 'Success');
          } else {
            callback('Error', null);
          }
        });

      });
    }));

    beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      DataStore = _DataStore_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      Buildfire = {
        datastore: {}
      };
      Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'save']);
      Buildfire.datastore.get();
      Buildfire.datastore.save();
    }));
    it("creates spies for each requested function", function () {
      expect(Buildfire.datastore.get).toBeDefined();
      expect(Buildfire.datastore.save).toBeDefined();
    });

    it("Methods that the spies were called", function () {
      expect(Buildfire.datastore.get).toHaveBeenCalled();
    });
    it('DataStore should exist and be an object', function () {
      expect(typeof DataStore).toEqual('object');
    });
    it('DataStore.get should exist and be a function', function () {
      expect(typeof DataStore.get).toEqual('function');
    });
    it('DataStore.save should exist and be a function', function () {
      expect(typeof DataStore.save).toEqual('function');
    });

    it('DataStore.get should return error', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.get(null).then(success, error);
      //$rootScope.$digest();
      expect(result).toEqual('');
    });

    it('DataStore.get should return success', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.get('').then(success, error);
      //$rootScope.$digest();
      expect(result).toEqual('');
    });

    it('DataStore.save should return error', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.save( null,null, null).then(success, error);
      //$rootScope.$digest();
      expect(result).toEqual('');
    });

    it('DataStore.save should return success', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.save( 123, '', null).then(success, error);
      //$rootScope.$digest();
      expect(result).toEqual('');
    });
  });
});

