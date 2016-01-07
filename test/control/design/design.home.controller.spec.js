/**
 * Created by ttnd on 4/9/15.
 */
describe('Unit : contactUsPlugin design.home.controller.js', function () {
  var $scope, DesignHome, $rootScope, q, $controller, DataStore, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES;
  beforeEach(module('contactUsPluginDesign'));

  beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _DataStore_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_) {
    $rootScope = _$rootScope_;
    q = _$q_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    DataStore = _DataStore_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
  }));

  beforeEach(function () {
    inject(function ($injector, $q) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      DesignHome = $injector.get('$controller')('DesignHomeCtrl', {
        $scope: $scope,
        data: {
          design: {
            listLayout: "test",
            backgroundImage: "test1"
          }
        },
        Buildfire: {
          imageLib: {
            showDialog: function (options, callback) {
              DesignHome._callback(null, {selectedFiles: ['test']});
            }
          },
          components: {
            images: {
              thumbnail: function () {

              }
            }
          },
          datastore: {
            get: function (a,b) {b(null,{data:{listLayout:'',backgroundImage:"g"}}); },
            save: function () { }
          }
        }
      });
      q = $q;
    });
  });

  describe('Variable Unit: DesignHome.layouts', function () {
    it('it should pass if DesignHome.layouts match the result', function () {
      expect(DesignHome.layouts).toEqual({
        listLayouts: [
          {name: "Layout_1"},
          {name: "Layout_2"}
        ]
      });
    });
  });

  describe('Function :DesignHome.changeItemLayout', function () {
    it('DesignHome.changeItemLayout should exist and be a function', function () {
      expect(typeof DesignHome.changeItemLayout).toEqual('function');
    });
    it('it should pass if  DesignHome.contactUsDesignData.design.listLayout is equals to "Layout_1" after passing parameter "Layout_1" to DesignHome.changeItemLayout', function () {
      DesignHome.data = {
        design: {listLayout: ''}
      };
      DesignHome.changeItemLayout('Layout_1');
      expect(DesignHome.data.design.listLayout).toEqual('Layout_1');
    });
  });
});