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
	self.maker = new google.maps.Marker({
	    		position: {lat:data.lat, lng:data.lng},
	    		title: data.name,
	    		map:myMap
	    	});
	self.lat = data.lat;
	self.lng = data.lng;
	self.name = data.name;
};

var ViewModel = function () {
	var self = this;

	self.points = ko.observableArray([]);
	self.search = ko.observable();
	// var infoWindow = new google.maps.InfoWindow({map:map});
	// var myLatLng = {lat:21.783093, lng:-71.764755};
	// infoWindow.setPosition(myLatLng);
	// infoWindow.setContent('Location found.');
	// map.setCenter(myLatLng);
    //map marker
    self.initPoints = function () {
	    poiList.forEach( function(poi) {
	    	//console.log(poi);
	    	self.points.push(new Point(poi));
	    });
	};
    //marker.setMap(map);
};

var vm = new ViewModel();
ko.applyBindings(vm);

//callback for google map api
//to do: move parameter to data model
// center location geocode
// zoom level (the larger values means higer resolution)
// list of locations
function initMap(data) {
	myMap = new google.maps.Map(document.getElementById('map'), {
		center: {lat:21.780565, lng:-71.939691},
		zoom: 10});
	vm.initPoints();
};