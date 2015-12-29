var myMap = myMap || {};

var poiList = [
	{
		name: "Beaches Turks & Caicos Resort Villages & Spa",
		lat:21.787467, 
		lng:-72.196612
	},
	{
		name: "Sunset Point Oceanfront Villa",
		lat: 21.747311, 
		lng: -72.293833
	},
	{
		name: "Alexandra Resort",
		lat: 21.791558, 
		lng: -72.192266
	},
	{
		name: "South Caicos Ocean & Beach Resort",
		lat: 21.487692, 
		lng: -71.527671 
	},
	{
		name: "Easy Bay Resort",
		lat: 21.489424, 
		lng: -71.522697
	},
	{
		name: "Club Med Turkoise",
		lat: 21.803752,  
		lng: -72.168403
	}
];

var Point = function (data) {
	var self = this;
	self.marker = new google.maps.Marker({
	    		position: {lat:data.lat, lng:data.lng},
	    		title: data.name,
	    		animation: google.maps.Animation.DROP,
	    		map:myMap
	    	});
	
	self.marker.addListener('click', function() {
		myMap.setZoom(15);
		myMap.panTo(self.marker.getPosition());
		searchWiki(self);
		searchStreetView(self);
		searchFourSquare(self);

		var content = '<div id="content">'+
      		'<div id="siteNotice">'+
      		'</div>'+
      		'<h3 id="heading" class="heading">'+
      		self.name+'</h3>';
      	if (self.svImg) {
      		content += '<img src="'+self.svImg+'">';
      	};
		if (self.wikiItems && self.wikiItems.length>0) {
			content += self.wikiItems[0];
		};
		console.log(self.fourSqrItems);
		if (self.fourSqrItems && self.fourSqrItems.length>0) {
			content += self.fourSqrItems[0];
		};
		mvm.infoWindow.setContent(content);
		console.log(content);
		mvm.infoWindow.open(myMap,self.marker);
	});
	self.lat = data.lat;
	self.lng = data.lng;
	self.name = data.name;
};

var ViewModel = function () {
	var self = this;
	self.openDrawer = ko.observable(false);
	self.points = ko.observableArray([]);
	self.search = ko.observable("");
	self.infoWindow = {}; //keep only one infowindow
    //map marker
    self.initPoints = function () {
	    self.infoWindow = new google.maps.InfoWindow();
	    poiList.forEach( function(poi) {
	    	//console.log(poi);
	    	self.points.push(new Point(poi));
	    });
	};
	
	self.showList = function () {
		console.log("in showList");
		self.openDrawer(true);
	};
	self.hideList = function () {
		console.log("in hideList");
		self.openDrawer(false);
	};

	self.filteredArray = ko.computed(function(){
		return self.points().filter(function(p){
			return (p.name.toLowerCase().indexOf(self.search().toLowerCase()) > -1);
		});
	}, this).extend({ rateLimit: 50 });
	
	self.filteredArray.subscribe(function(newValue){
		
		var changes = ko.utils.compareArrays(self.points(), newValue);
		console.log(changes); 
		//changes.status - retained or deleted 
		//remove marker for deleted
		changes.forEach(function(c){
			if (c.status === "deleted") {
				c.value.marker.setMap(null);
			}
			else {
				c.value.marker.setMap(myMap);
			}

		});
	});
    //marker.setMap(map);
    self.selectItem = function(poi) {
    	//console.log("in selectItem")
    	google.maps.event.trigger(poi.marker, 'click');
  	};

};

function searchWiki(poi) {
	
	if (poi.wikiItems != null) return;

	var wikipediaUrl="https://en.wikipedia.org/w/api.php?";
    wikipediaUrl += "action=opensearch&format=json&search=";
    wikipediaUrl += poi.name;
    console.log(wikipediaUrl);
    $.ajax(wikipediaUrl, 
        {
            dataType: "jsonp",
            jsonpCallback: "handleResp",
            success: function (data) {
            	console.log("in success");
                var items = [];
                // data from opensearch search
                var titles = data[1];
                var snippets = data[2];
                var urls= data[3];
                for (var i=0; i<titles.length; i++) {
                    items.push('<li> <a href="'+
                        urls[i] +'">'+
                        titles[i]+"</a><p>"+
                        snippets[i]+"</p></li>");
                };
                poi.wikiItems = items;
            }
        });

};

function handleResp(){

};
function searchStreetView(poi) {
	var streetviewUrl = "https://maps.googleapis.com/maps/api/streetview?";
    streetviewUrl+="size=120x60";
    streetviewUrl+="&location="+poi.lat+","+poi.lng;
    streetviewUrl+="&key=AIzaSyBj2cupFih8gYKU3QPbBc8lnfeiAaJqGAU";
    poi.svImg = streetviewUrl;
};

function searchFourSquare(poi) {
	var apiUrl="https://api.foursquare.com/v2/venues/search?";
	apiUrl += "ll="+poi.lat+","+poi.lng;
	apiUrl += "&limit=1";
	apiUrl += "&client_id=3UXOGK5DZSPYKKQ1GSQ2V4G0HNWP3RPR2GEYWKRJEZPR3GF1&client_secret=DP2GBAPXJVKIGKTIYDXJLYMU4IKXPKX3FE2L51QCTHJHIVAB&v=20151228";
	$.ajax(apiUrl, 
        {
            dataType: "jsonp",
            jsonpCallback: "handleResp",
            success: function (data) {
            	// console.log("in success");
            	// console.log(data);
                var items = [];
                if (! data.response || ! data.response.venues) {
                	return;
                };
                var v = data.response.venues;

                for (var i=0; i<v.length; i++) {
                    items.push('<li> <a href="'+
                        v[i].url +'">'+
                        v[i].name+"</a><p>"+
                        v[i].contact.formattedPhone+"</p></li>");
                };
                poi.fourSqrItems = items;
                console.log (poi.fourSqrItems);
            }
        });
};

var mvm = new ViewModel();
ko.applyBindings(mvm);

//callback for google map api
//to do: move parameter to data model
// center location geocode
// zoom level (the larger values means higer resolution)
// list of locations
function initMap(data) {
	myMap = new google.maps.Map(document.getElementById('map'), {
		center: {lat:21.850565, lng:-72.039691},
		zoom: 10});
	mvm.initPoints();
};