describe('Unit : contactUs Plugin widget.home.controller.js', function () {
    var WidgetHome, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, LAYOUTS, STATUS_MESSAGES, CONTENT_TYPE, q;
    beforeEach(module('contactUsPluginWidget'));
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
        Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor','onAddItems']);

    }));

    beforeEach(function () {
        ContentHome = $controller('WidgetHomeCtrl', {
            $scope: scope,
            $q: q,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            ActionItems: ActionItems,
            STATUS_CODE: STATUS_CODE,
            CONTENT_TYPE: CONTENT_TYPE,
            LAYOUTS: LAYOUTS
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






})
;