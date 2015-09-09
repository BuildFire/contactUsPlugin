/**
 * Created by ttnd on 4/9/15.
 */
describe('Unit : contactUsPlugin design.home.controller.js', function () {
    var $scope, DesignHome, $rootScope, q, $controller, DataStore, ImageLibrary, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES;
    beforeEach(module('contactUsPluginDesign'));

    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _DataStore_, _ImageLibrary_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_) {
        $rootScope = _$rootScope_;
        q = _$q_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        DataStore = _DataStore_;
        TAG_NAMES = _TAG_NAMES_;
        STATUS_CODE = _STATUS_CODE_;
        STATUS_MESSAGES = _STATUS_MESSAGES_;
        ImageLibrary = jasmine.createSpyObj('ImageLibrary', ['showDialog']);
    }));

    beforeEach(function () {
        DesignHome = $controller('DesignHomeCtrl', {
            $scope: $scope,
            $q: q,
            DataStore: DataStore,
            ImageLibrary: ImageLibrary,
            TAG_NAMES: TAG_NAMES
        });
    });

    describe('Units: units should be Defined', function () {
        it('it should pass if DataStore is defined', function () {
            expect(DataStore).not.toBeUndefined();
        });
        it('it should pass if ImageLibrary is defined', function () {
            expect(ImageLibrary).not.toBeUndefined();
        });
        it('it should pass if TAG_NAMES is defined', function () {
            expect(TAG_NAMES).not.toBeUndefined();
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
    describe('Function :DesignHome.addBackgroundImage', function () {
        it('DesignHome.addItemDetailsBackgroundImage should exist and be a function', function () {
            expect(typeof DesignHome.addBackgroundImage).toEqual('function');
        });
        it('it should Fail after DesignHome.addBackgroundImage function call', function () {
            ImageLibrary.showDialog.and.callFake(function () {
                var deferred = q.defer();
                deferred.reject({
                    code: STATUS_CODE.UNDEFINED_OPTIONS,
                    message: STATUS_MESSAGES.UNDEFINED_OPTIONS
                });
                return deferred.promise;
            });
            DesignHome.data={
                design:{backgroundImage:''}
            };
            DesignHome.addBackgroundImage();
            $rootScope.$digest();
            expect(DesignHome.data.design.backgroundImage).toEqual('');
        });
    });
    describe('Function :DesignHome.changeListLayout', function () {
        it('DesignHome.changeListLayout should exist and be a function', function () {
            expect(typeof DesignHome.changeListLayout).toEqual('function');
        });
        it('it should pass if  DesignHome.contactUsDesignData.design.listLayout is equals to "Layout_1" after passing parameter "Layout_1" to DesignHome.changeListLayout', function () {
            DesignHome.data={
                design:{listLayout:''}
            };
            DesignHome.changeListLayout('Layout_1');
            expect( DesignHome.data.design.listLayout).toEqual('Layout_1');
        });
    });
    describe('Function :DesignHome.removeBackgroundImage', function () {
        it('DesignHome.removeBackgroundImage should exist and be a function', function () {
            expect(typeof DesignHome.removeBackgroundImage).toEqual('function');
        });
        it('it should pass if DesignHome.data.design.itemDetailsBgImage is equals to null after function DesignHome.removeItemDetailsBackgroundImage call', function () {
            DesignHome.data={
                design:{backgroundImage:''}
            };
            DesignHome.removeBackgroundImage();
            $rootScope.$digest();
            expect(DesignHome.data.design.backgroundImage).toEqual(null);
        });
    });

})
;