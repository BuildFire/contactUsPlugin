var conapp = angular.module('controllerapp',['ui.bootstrap','ui.sortable','ui.tinymce','mapModule']);
        
        conapp.controller('ModalInstanceCtrl',['$scope','$modalInstance','items', function($scope,$modalInstance,items){
            
        	$scope.data = items;
        	console.log($scope.data);
            $scope.vewData = angular.copy($scope.data);
            $scope.gPlace;
            
            /*save function for modal of image */

            $scope.save = function(){
            
              if($scope.data == undefined){
            	  $scope.data = {
            			  array:[$scope.addImageDetail]
            	  };
              }else if($scope.data.array == undefined){
                  $scope.data.array = [$scope.addImageDetail];
              }else{
                  $scope.data.array.push($scope.addImageDetail);
              }

                $scope.imagetitle= "";
                $scope.imageurl = "";
                $modalInstance.close();
            }
            

            $scope.addimage = function(){
                
            	$scope.addImageDetail = {
	            	        image_linkstatus:"Link",
	            	        image_src:"",
	            	        image_title:"",
	            	        imageurl:"",
	            	        openinapp:false
            	        };

                buildfire.imageLib.showDialog({showIcons: false, multiSelection: true}, function (error, result) {
                    if (result && result.selectedFiles && result.selectedFiles.length > 0) {
                        image_src = result.selectedFiles[0];
                        var newUrl = buildfire.imageLib.resizeImage(image_src, {width:400,height:200});
                        var newUrl1 = buildfire.imageLib.cropImage(newUrl, {width:400,height:400});
                        $scope.addImageDetail.image_src =newUrl1;
                       $scope.$apply();
                    }else{
                        alert("we have no image");
                    }
                });
            }
              $scope.ok = function () {
                 if($scope.vewData.imageurl == "" || $scope.vewData.imageurl == undefined){
                	 $scope.vewData.image_linkstatus = "Link"
                
                 }else{
                	 $scope.vewData.image_linkstatus = "Linked"
                 
                 }
                 
                 $scope.data.imageurl = $scope.vewData.imageurl;
                 $scope.data.image_linkstatus = $scope.vewData.image_linkstatus;
                 $scope.data.openinapp = $scope.vewData.openinapp;
                 $scope.data.image_title = $scope.vewData.image_title;
                 $modalInstance.close();
              };

              $scope.cancel = function () {
            	  
                $modalInstance.dismiss('cancel');
             };
                   	
        }]);

        conapp.controller('contentcontroller',['$scope','$rootScope','$modal','$log',function($scope,$rootScope,$modal,$log,mapService){

           /************************* Model Section ***************************/
           
        	  $scope.remove_item1= function(index){
           	   $scope.data.actionItems.splice(index,1);
           	   
              };

              
              $scope.addLink = function(){
           	   
                 
                      var actionItem1 = {
                          title: "build fire",
                          "url": "https://www.facebook.com/buildfireapps",
                          action: "linkToWeb",
                          openIn: "browser",
                          actionName: "Link to Web Content"
                      };
                      var options = {showIcon: true};
                      buildfire.actionItems.showDialog(null, options, function (err, actionItem) {
                         
                    	  
                    	  if (err)
                              console.log(err);
                          else {
                        	  if(actionItem == null){
                        		  return false;
                        	  };
                              if(!$scope.data){
                            	  $scope.data ={
                            			  		"actionItems":[]
                            	  };
                              }else if(!$scope.data.actionItems)
                            	 {
                                   $scope.data.actionItems = [];
                            	 }
                              $scope.data.actionItems.push(actionItem);
                              console.log(actionItem);
                              $scope.$apply();
                            }

                      });
                  
           	   
              };

        	$scope.location = "0,0";
        	
        	
        	

            $scope.animationsEnabled = true;
            $scope.open = function (name,data) {
            	console.log(data);
            	if(name == "addImgTpl"){
            		if($scope.data){
            			$scope.items = $scope.data;
            		}else{
            			$scope.data = {};
            			$scope.items = $scope.data;
            		}
            			
            	}else{
            		$scope.items = data;
            	}
            	
            	
             	var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'template/' + name + '.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                  items: function () {
                    return $scope.items;
                  }
                }
              });

              modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
              }, function () {
                $log.info('Modal dismissed at: ' + new Date());
              });
            };

            $scope.toggleAnimation = function () {
              $scope.animationsEnabled = !$scope.animationsEnabled;
            };
           
 
           /************************* Model Section End ***********************/

           

            $scope.save = function(data){
            
              if($scope.data == undefined){
            	  $scope.data = {
            			  array:[data]
            	  };
              }else if($scope.data.array == undefined){
                  $scope.data.array = [data];
              }else{
                  $scope.data.array.push(data);
              }

                $scope.imagetitle= "";
                $scope.imageurl = "";
               
            }
            

            $scope.addimage = function(){
                
            	$scope.addImageDetail = {
	            	        image_linkstatus:"Link",
	            	        image_src:"",
	            	        image_title:"",
	            	        imageurl:"",
	            	        openinapp:false
            	        };

                buildfire.imageLib.showDialog({showIcons: false, multiSelection: true}, function (error, result) {
                    if (result && result.selectedFiles && result.selectedFiles.length > 0) {
                        console.log(result.selectedFiles);
                    	i = 0;
                    	var imgDetail;
                        for(i=0 ; i < result.selectedFiles.length ; i++){
                        	var image_src = result.selectedFiles[i];
                            $scope.addImageDetail.image_src = image_src;
                            imgDetail = angular.copy($scope.addImageDetail);
                            $scope.save(imgDetail);	
                        }
                        $scope.$apply();
                    }else{
                        alert("we have no image");
                    }
                });
            }
            
            
            
            
            
           $scope.remove_item = function(index){
        	   $scope.data.array.splice(index,1);
            }



           buildfire.datastore.get(function (err, result) {
               if(result) {
                   $scope.data= result.data;
                   if($scope.data.content && $scope.data.content.bodyclass){
               			$scope.detail = angular.copy($scope.data.content.bodyclass);
               		}
                   if($scope.data.content && $scope.data.content.locationLat){
              			$scope.location = $scope.data.content.locationLat +',' + $scope.data.content.locationLong;
              		}
                   $scope.$digest();
                   if (tmrDelay)clearTimeout(tmrDelay);
               }

           });
           
           

          
            /*
             * Call the datastore to save the data object
             */
            var saveData = function(newObj){
                if(newObj == undefined){
                    return;
                }
                buildfire.datastore.save(newObj, function (err, result) {
                    if (err || !result)
                        alert(err);
                    else
                        console.log('data saved');
                });
            };

            /*
             * create an artificial delay so api isnt called on every character entered
             * */
            var tmrDelay = null;
            var saveDataWithDelay = function(newObj){
                console.log("!!! data change");
                if(tmrDelay)clearTimeout(tmrDelay);
                tmrDelay = setTimeout(function(){saveData(newObj);},500);
            };
            
            
            //function for handling the change data in WYSIWIG
            
            $scope.chanageWYSIWYG = function(data){
            	if($scope.data == undefined){
            		return false;
            	}
            	if($scope.data.content){
            		$scope.data.content.bodyclass = angular.copy(data);
            		
            	}else{
            		$scope.data.content = {
            				bodyclass:angular.copy(data)
            		}
            		
            	}
            }
            
            

            /*
             * watch for changes in data and trigger the saveDataWithDelay function on change
             * */
            $scope.$watch('data',saveDataWithDelay ,true);

//            $scope.$watch('location',function(){
//        		setTimeout(function(){
//        			if($scope.location){
//	        		var res = $scope.location.split(",");
////	        		console.clear();
////	        		alert("test location");
////	        		console.log($scope.data);
//	        		if($scope.data.content && $scope.data.content.locationLat){
//	        	    	$scope.data.content.locationLat = res[0];
//	        	    	$scope.data.content.locationLong = res[1];
//	        	    	
//	        	    }else{
//	        	    	$scope.data.content = {
//	        	    			locationLat:res[0],
//	        	    			locationLong:res[0]
//	        	    	}
//	        	    }
//        			}
//        		},1000);
//        		
//        	},true);
//             alert("doner");


            /************** Select Image Start ***********************/


        }]);

