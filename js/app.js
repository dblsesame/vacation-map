var map = map || {};

//callback for google map api
//to do: move parameter to data model
// center location geocode
// zoom level (the larger values means higer resol)
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 21.397, lng: -72.644},
		zoom: 10
	});
	var infoWindow = new google.maps.InfoWindow({map:map});


	var myLatLng = {lat:21.783093, lng:-71.764755};
	infoWindow.setPosition(myLatLng);
	infoWindow.setContent('Location found.');
	map.setCenter(myLatLng);
    //map marker

    var marker = new google.maps.Marker({
    	position: myLatLng,
    	title: "My Marker",
    	map:map
    });
    //marker.setMap(map);
};