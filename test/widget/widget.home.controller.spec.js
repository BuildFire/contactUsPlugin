describe('Unit : contactUs Plugin widget.home.controller.js', function () {
    var WidgetHome, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, LAYOUTS, STATUS_MESSAGES, CONTENT_TYPE, q, view;
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
        view = {
            loadItems: function () {
            }
        };
        Buildfire = {
            components: {
                carousel: {
                    editor: function (name) {
                        return {}
                    },
                    viewer: function (name) {
                        return {}
                    },
                    view: function () {
                    }
                }
            },
            imageLib: {
                cropImage: function () {
                    return 'test';
                }
            },
            actionItems: {
                list: jasmine.createSpy()
            }
        };
        ActionItems = jasmine.createSpyObj('ActionItems', ['showDialog']);
        Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor', 'onAddItems', "view"]);

    }));

    beforeEach(function () {
        WidgetHome = $controller('WidgetHomeCtrl', {
            $scope: scope,
            $q: q,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            ActionItems: ActionItems,
            STATUS_CODE: STATUS_CODE,
            CONTENT_TYPE: CONTENT_TYPE,
            LAYOUTS: LAYOUTS,
            DataStore: {
                get: function () {
                    var deferred = q.defer();
                    deferred.resolve(['Remote call result']);
                    return deferred.promise;
                },
                onUpdate: function () {
                    var deferred = q.defer();
                    deferred.resolve(['Remote call result']);
                    return deferred.promise;
                }
                ,
                clearListener: function () {
                }
            }
        });
    });

    describe('Units: units should be Defined', function () {
        it('it should pass if ContentHome is defined', function () {
            expect(WidgetHome).not.toBeUndefined();
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

    describe('$destroy', function () {
        it('should invoke when get $destroy', function () {
            $rootScope.$broadcast('$destroy');
        });
    });

    describe('Carousel:LOADED', function () {
        it('should invoke when get Carousel:LOADED', function () {
            WidgetHome.view = {
                loadItems: function () {
                }
            };
            $rootScope.$broadcast('Carousel:LOADED');
        });
    });

    describe('WidgetHome.cropImage', function () {
        it('should pass if it crops the image when the url provided is valid', function () {
            var result = WidgetHome.cropImage('test', {height: 1, width: 1});
            expect(result).toEqual('test');
        });

        it('should pass if it returns blank when the url is invalid', function () {
            var result = WidgetHome.cropImage('', {height: 1, width: 1});
            expect(result).toEqual('');
        });
    });

    describe('WidgetHome.openLinks', function () {
        it('should pass if it calls actionItems list if the actionItems is valid and is not empty', function () {
            WidgetHome.openLinks([{a: 1}]);
            expect(Buildfire.actionItems.list).toHaveBeenCalled();
        });

        it('should pass if it doesnt call actionItems list method if the actionItems is empty', function () {
            WidgetHome.openLinks([]);
            expect(Buildfire.actionItems.list).not.toHaveBeenCalled();
        });
    });

    describe('WidgetHome.safeHtml', function () {
        it('should pass if it returns html when valid string is passed', function () {
            var result = WidgetHome.safeHtml('<a></a>');
            expect(result).not.toEqual('<a></a>');
        });

        it('should pass if it returns falsy when invalid argument is passed', function () {
            var result = WidgetHome.safeHtml('');
            expect(result).toBeFalsy();
        });
    });

    describe('WidgetHome.onAddressClick', function () {
        var spy;
        beforeEach(function () {
            spy = spyOn(window.buildfire.navigation, 'openWindow')
        });

        it('should pass if it returns html when valid string is passed', function () {
            WidgetHome.device = {platform: 'ios'};
            WidgetHome.onAddressClick(1, 1);
            expect(spy).toHaveBeenCalledWith('maps://maps.google.com/maps?daddr=1,1');
        })

        it('should pass if it returns html when valid string is passed', function () {
            WidgetHome.device = {platform: 'android'};
            WidgetHome.onAddressClick(1, 1);
            expect(spy).toHaveBeenCalledWith('http://maps.google.com/maps?daddr=1,1');
        });
    });


});