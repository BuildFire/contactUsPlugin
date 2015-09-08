describe('Unit : contactUsPlugin content Enums', function () {
  var TAG_NAMES, STATUS_CODE, ADDRESS_TYPE;
  beforeEach(module('contactUsPluginContent'));

  beforeEach(inject(function (_TAG_NAMES_, _STATUS_CODE_, _ADDRESS_TYPE_) {
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    ADDRESS_TYPE = _ADDRESS_TYPE_;
  }));

  describe('Enum : TAG_NAMES', function () {
    it('TAG_NAMES should exist and be an object', function () {
      expect(typeof TAG_NAMES).toEqual('object');
    });
    it('TAG_NAMES.CONTACT_INFO should exist and equals to "ContactInfo"', function () {
      expect(TAG_NAMES.CONTACT_INFO).toEqual('ContactInfo');
    });
  });

  describe('Enum : STATUS_CODE', function () {
    it('STATUS_CODE should exist and be an object', function () {
      expect(typeof STATUS_CODE).toEqual('object');
    });
    it('STATUS_CODE.INSERTED should exist and equals to "inserted"', function () {
      expect(STATUS_CODE.INSERTED).toEqual('inserted');
    });
    it('STATUS_CODE.UPDATED should exist and equals to "updated"', function () {
      expect(STATUS_CODE.UPDATED).toEqual('updated');
    });
    it('STATUS_CODE.NOT_FOUND should exist and equals to "NOTFOUND"', function () {
      expect(STATUS_CODE.NOT_FOUND).toEqual('NOTFOUND');
    });
  });

  describe('Enum : ADDRESS_TYPE', function () {
    it('ADDRESS_TYPE should exist and be an object', function () {
      expect(typeof ADDRESS_TYPE).toEqual('object');
    });
    it('ADDRESS_TYPE.LOCATION should exist and equals to "Location"', function () {
      expect(ADDRESS_TYPE.LOCATION).toEqual('Location');
    });
    it('ADDRESS_TYPE.SINGLE_VIDEO should exist and equals to "Coordinates"', function () {
      expect(ADDRESS_TYPE.COORDINATES).toEqual('Coordinates');
    });
  });
});
