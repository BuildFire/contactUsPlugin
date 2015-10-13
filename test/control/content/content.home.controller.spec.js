describe('Unit : contactUs Plugin content.home.controller.js', function () {
  var ContentHome, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, LAYOUTS, STATUS_MESSAGES, CONTENT_TYPE, q, Utils;
  beforeEach(module('contactUsPluginContent'));
  var editor;
  beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _TAG_NAMES_, _STATUS_CODE_, _LAYOUTS_, _STATUS_MESSAGES_) {
    $rootScope = _$rootScope_;
    q = _$q_;
    scope = $rootScope.$new();
    $controller = _$controller_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
    LAYOUTS = _LAYOUTS_;
    // Utils = __Utils__;
    Buildfire = {
      components: {
        carousel: {
          editor: function (name) {
            return {}
          },
          viewer: function (name) {
            return {}
          }
        }
      }
    };
    ActionItems = jasmine.createSpyObj('ActionItems', ['showDialog']);
    Utils = jasmine.createSpyObj('Utils', ['validLongLats']);
    Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor', 'onAddItems']);

  }));

  beforeEach(function () {
    ContentHome = $controller('ContentHomeCtrl', {
      $scope: scope,
      $q: q,
      Buildfire: Buildfire,
      TAG_NAMES: TAG_NAMES,
      ActionItems: ActionItems,
      STATUS_CODE: STATUS_CODE,
      CONTENT_TYPE: CONTENT_TYPE,
      LAYOUTS: LAYOUTS,
      Utils: Utils
    });
  });

  describe('Units: units should be Defined', function () {
    it('it should pass if ContentHome is defined', function () {
      expect(ContentHome).not.toBeUndefined();
    });
    it('it should pass if Buildfire is defined', function () {
      expect(Buildfire).not.toBeUndefined();
    });
    it('it should pass if TAG_NAMES is defined', function () {
      expect(TAG_NAMES).not.toBeUndefined();
    });
    it('it should pass if STATUS_CODE is defined', function () {
      expect(STATUS_CODE).not.toBeUndefined();
    });
  });

  describe('ContentHome.masterData', function () {
    it('it should pass if ContentHome.masterData match the result', function () {
      expect(ContentHome.masterData).toEqual({
        "content": {
          "carouselImages": [],
          "description": '<p>&nbsp;<br></p>',
          "addressTitle": "",
          "address": {},
          "links": [],
          "showMap": true
        },
        "design": {
          "listLayout": LAYOUTS.listLayouts[0].name,
          "backgroundImage": ""
        }

      });
    });
  });


  describe('ContentHome.data', function () {
    it('it should pass if ContentHome.data is match the result', function () {
      expect(ContentHome.data).toEqual({
        "content": {
          "carouselImages": [],
          "description": '<p>&nbsp;<br></p>',
          "addressTitle": "",
          "address": {},
          "links": [],
          "showMap": true
        },
        "design": {
          "listLayout": LAYOUTS.listLayouts[0].name,
          "backgroundImage": ""
        }
      });
    });
  });
  it('it should pass if ContentHome.showDialog accept ContentHome.data.content.links', function () {
    Buildfire.actionItems = {

      showDialog: function (a, d, func) {
        func(null, {addLinks: ['test']});
      }
    };

    ContentHome.openAddLinkPopup();
    scope.$digest();
    expect(ContentHome.data.content.links[0].addLinks[0]).toEqual('test');
  });
  it('it should pass if ContentHome.showDialog in Edit links ContentHome.data.content.links in success case', function () {
    var link = {editLinks: ['test']}, index = 0;
    Buildfire.actionItems = {

      showDialog: function (link, d, func) {
        console.log(123);
        func(null, {editLinks: ['test']});
      }
    };

    ContentHome.openEditLinkPopup(link, index);
  });
  it('it should pass if ContentHome.showDialog accept the index', function () {
    var index = 0;
    ContentHome.removeLink(index);

  });

  it('#setLocation it should pass if it get the changed data', function () {
    ContentHome.currentAddress = "";
    ContentHome.currentCoordinates = "";
    ContentHome.data = {};
    var obj = {
      "location": "Delhi",
      "coordinates": "19.2012,20.1234"
    };

    ContentHome.setLocation(obj);
    expect(ContentHome.currentAddress).toEqual(obj.location);
    expect(ContentHome.currentCoordinates).toEqual(obj.coordinates);
  });
  it('#setDraggedLocation it should pass if it get the changed data', function () {
    ContentHome.currentAddress = "";
    ContentHome.currentCoordinates = "";
    ContentHome.data = {};
    var obj = {
      "location": "Delhi",
      "coordinates": "19.2012,20.1234"
    };
    ContentHome.setDraggedLocation(obj);
    expect(ContentHome.currentAddress).toEqual(obj.location);
    expect(ContentHome.currentCoordinates).toEqual(obj.coordinates);
  });


  it('#setCoordinates it should pass if it get the changed data', function () {
    ContentHome.currentAddress = "";
    ContentHome.currentCoordinates = "";
    ContentHome.data = {};
    Utils.validLongLats.and.callFake(function () {
      var deferred = q.defer();
      deferred.resolve({
        "location": ["19.2012, 20.1234"],
        "location_coordinates": ["19.2012, 20.1234"]
      });
      return deferred.promise;
    });
    ContentHome.setCoordinates();
    $rootScope.$digest();
    expect(ContentHome.data.content.address.location).toEqual("19.2012, 20.1234");
    expect(ContentHome.currentCoordinates).toEqual('19.2012, 20.1234');

  });
  it('#clearData it should pass if data is null', function () {
    ContentHome.clearData();
    expect(ContentHome.data.content.address).toEqual(null);
    expect(ContentHome.data.content.links).toEqual(null);
    expect(ContentHome.currentCoordinates).toEqual(null);
  });
})
;