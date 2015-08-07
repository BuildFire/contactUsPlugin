/**
 * Created by abhay on 31/7/15.
 */

var textPluginApp = angular.module('widgetappmod', ['ui.bootstrap']);

textPluginApp.controller('contactusPluginCtrl', ['$rootScope','$scope','$location','widgetservice' ,function ($rootScope,$scope,$location,widgetservice) {


	
	$scope.changeLocation = function(data){
      var path = window.location.href;
      path = path.split("#");
      window.location.href = path[0] +"#/"+ data;
  }

 // Getting all data from buildfire API	
	  $scope.getData = function(){
		  buildfire.datastore.get(function (err, result) {
	          if(result) {

		            widgetservice  = result.data;
		            $scope.query = widgetservice.content.address;
		            $scope.codeAddress();
		            $scope.$broadcast("dataUpdated",result.data);
		            if(widgetservice.design && widgetservice.design.layout){
		            	$scope.changeLocation(widgetservice.design.layout);	
		            }
		            
		            if(widgetservice.content && widgetservice.content.locationLat ){
		            	$scope.location = widgetservice.content.locationLat + ',' + widgetservice.content.locationLong;
		            }
		            
		            
		            $scope.$digest();
		        }
		    });  
	  }
  
  $scope.getData();
  /* Listen in if an update occurred on the control panel  */
  
  
  $scope.updatedData = function(){
	 buildfire.datastore.onUpdate(function (newObj) {
	     $scope.data = newObj.obj;
	      $scope.query = $scope.data.content.address;
	      
	      $scope.codeAddress();
	      if( newObj.obj.design){
	      	$scope.changeLocation(newObj.obj.design.layout);
	      }
	      $scope.$broadcast("dataUpdated",newObj.obj);
	      $scope.$digest();
	  }); 
 }
  
 $scope.updatedData();
    /*here geocding  */
   
    $scope.codeAddress = function() {
      $scope.query;
    }
    
    // save data
    
    $scope.saveData = function(newObj){
       
        if(newObj == undefined)return;


        buildfire.datastore.save(newObj, function (err, result) {
            if (err || !result)
                alert(err);
            else
                console.log('data saved');
                console.log(newObj);
        });
    };
    
    /**
     * when a refresh is triggered get reload data
     */
       buildfire.datastore.onRefresh($scope.getData);
       
    
    buildfire.analytics.trackAction('widget loaded',{userid:2});
}]);



textPluginApp.controller('layout1Ctrl', ['$scope','$location','widgetservice','$sce' ,function ($scope,$location,widgetservice,$sce) {

	
	  $scope.items1 = [1,2,3,4,5];
	  $scope.items2 = [1,2,3,4,5,6,7,8,9,10];
	  
	
	
	
	$scope.setData = function(option){				
		$scope.dataForView  = option;	
		$scope.dataForView.content.bodyclass  = $sce.trustAsHtml($scope.dataForView.content.bodyclass);
		
	
	}
	
	if(widgetservice){
		$scope.setData(widgetservice);
	}else{
		$scope.getData();
	}
	
	$scope.showItemlist1 = function(){
		
		 buildfire.actionItems.list($scope.data.actionItems, null, function (err, actionItem) {
             if (err){
            	 console.log(err);
             }
                 

         });
		
	}
	
	$scope.$on("dataUpdated",function(e,data){
	//	alert("data updated");
		$scope.setData(data);
	});
	
	$scope.$on("dataChangedFromMap",function(){
		    var dataToBeSave = angular.copy($scope.dataForView); 
			$scope.saveData(dataToBeSave);
    });
	
}]);




textPluginApp.controller('layout2ctrl',['$scope','$sce','$timeout',function($scope,$sce,widgetservice,$timeout){


	$scope.items1 = [1,2,3,4,5];
	  $scope.items2 = [1,2,3,4,5,6,7,8,9,10];
	  $scope.tempThumbnailList = [];
	  
	  $scope.thumb = ["https://imagelibserver.s3.amazonaws.com/fbfc2e49-3…ca55c361/28584c70-39d9-11e5-8c2c-712ea17a5363.jpg",
	                  "https://imagelibserver.s3.amazonaws.com/fbfc2e49-39d8-11e5-9d04-02f7ca55c361/a99b29f0-3a93-11e5-945e-7d01ee3c1728.jpg"
	                  ];
	
	$scope.setData = function(option){
		
		$scope.dataForView  = option;

		
		
//		if($scope.dataForView.array && $scope.dataForView.array.length){
//			$scope.tempThumbnailList = $scope.dataForView.array;
//			var length = $scope.dataForView.array.length;
//		    var tempThumbnailList = $scope.dataForView.array;
//		    $scope.thumbnailList = $scope.dataForView.array;
//		    
//		    $scope.thumbnailList = [];
//		    var y ;
//		    while(tempThumbnailList.length > 0){
//		        y =  tempThumbnailList.splice(0,3);
//		        $scope.thumbnailList.push(y);
//		    }		
//		}
		
		
	    if($scope.dataForView.content && $scope.dataForView.content.bodyclass){
	    	 $scope.dataForView.content.bodyclass = $sce.trustAsHtml($scope.dataForView.content.bodyclass); 	
	    }
	   
  }
		
		if(widgetservice){
			$scope.setData(widgetservice);
		}else{
			$scope.getData();
		}
		
		$scope.$on("dataUpdated",function(e,data){
					$scope.setData(data);
		});
		
		$scope.showItemlist2 = function(){
			
			if($scope.data.actionItems == null || $scope.data.actionItems == undefined){
				
//			alert("please insert an Action item");	
				
			}else{
				 buildfire.actionItems.list($scope.data.actionItems, null, function (err, actionItem) {				 				 				 
		                if (err){
		                	 console.log(err);
		                }	                   
		            });				
			}			
		}
		
		$scope.$on("dataChangedFromMap",function(){
		    var dataToBeSave = angular.copy($scope.dataForView); 
			$scope.saveData(dataToBeSave);
		});
		
}]);

textPluginApp.directive("openLink",function(){
	//app.newsFeed
	return {
		restrict:"AE",
		link: function(scope,element,attrs){
		  
		  element.on("click",function(){
			  var  ref = window.open(attrs.openLink,"_blank");
//			 var  ref = window.open(attrs.openLink, '_blank', 'location=yes');
		  });	
		}	
	};
	
})
