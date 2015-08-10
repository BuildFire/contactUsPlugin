
var serviceapp = angular.module('widgetsermod',[]);

serviceapp.factory('widgetservice',function(){
    var dataDefault = {

        array:[

            {
                image_linkstatus:null,
                image_src:null,
                image_title:null,
                imageurl:null,
                openinapp:false
            }
        ],

        content:{
            address:null,
            addresstitle:null,
            bgUrl:null,
            bodyclass:null,
            checkboxMode:true
        },

        design:{
            bgUrl:null,
            layout : "layout1"
        },

    };
    var widgetservice = widgetservice || false ;
    return widgetservice;
});