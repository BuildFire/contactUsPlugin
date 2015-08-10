// use to open link in windo

textPluginApp.directive("openLink",function(){
	//app.newsFeed
	return {
		restrict:"AE",
		link: function(scope,element,attrs){
		  
		  element.on("click",function(){
               if(attrs.openLink){
//            	   alert("in if " + buildfire);
            	   window.open(attrs.openLink,'_blank');
            	   if(attrs.openinapp == "true"){
//            		    buildfire.openWindow(attrs.openLink,'_system');
            	   }else{
//            		   buildfire.openWindow(attrs.openLink,'_blank');
            	   }
               }else{
//            	   alert("in else");
            	   return ;
               }
			  
		  });	
		}	
	};
	
});

// use to inject slider template of one slide
contactusPluginMap.directive('carouselslide', function(){
    return {
      restrict: 'E',
      transclude: true,
      scope: true,
      templateUrl:'templates/carousel.html' 
			   
    }
  });

// use to inject slider template for three slides
contactusPluginMap.directive('carouselslidethree', function(){
    return {
      restrict: 'E',
      transclude: true,
      scope: true,
      templateUrl:'templates/carouselthree.html' 
			   
    }
  });

// directive for owl carousel for layouts 
contactusPluginMap.directive('myOwlCarousel', function () {
	  return {
	    restrict: 'A',
	    link: function (scope, elem, attrs) {
	      scope.carousel = null;
	      scope.isCarouselInitiated = false;
	      scope.initCarousel = function() {
	        scope.carousel = null;
	        setTimeout(function () {
	          var obj = {
	            'items': $("#owl-demo").attr('data-caritem'),
	            'slideSpeed': 500,
	             'autoplayHoverPause': true,
	            'dots': $("#owl-demo").attr('data-caritem') == 3  ? false : true ,
	            'autoplay': 4000
	          };

	          var totalImages = parseInt(attrs.myOwlCarousel, 10);
	          if (totalImages) {
	            if (totalImages > 1) {
	              obj['loop'] = true;
	            }
	            scope.carousel = $("#owl-demo").owlCarousel(obj);
	            scope.isCarouselInitiated = true;
	          }
	          scope.$apply();
	        }, 100);
	      }

	    }
	  }
	});

// will init carousel when last item inserted in list 
contactusPluginMap.directive('owlCarouselItem', [function() {
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, element) {
		  // wait for the last item in the ng-repeat then call init
			if(scope.$last) {
				scope.initCarousel();
			}
			
			
		}
	};
}]);