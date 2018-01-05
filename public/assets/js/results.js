$(document).ready(function() {






	//----------------------------------Google Maps stuff
	var labels = '123456789';
	var labelIndex = 0;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var userLocation;






	var bound = new google.maps.LatLngBounds();


	$.get("api/users/online", function(data) {
		for (var i = 0; i < data.length; i++) {
			bound.extend( new google.maps.LatLng(locations[i][2], locations[i][3]) );
		}
	})

	console.log(bound.getCenter());







	// --- Whenever the map is loaded...
	function initMap() {
		// --- Thing needed for directions to display properly
		directionsDisplay = new google.maps.DirectionsRenderer();

		// --- THIS NEEDS TO BECOME THE CENTER OF ALL ADDRESSES **************************
		userLocation = new google.maps.LatLng(userLatitude, userLongitude);

		// --- Defining the map
		map = new google.maps.Map(document.getElementById('map'), {
			center: userLocation,
			zoom: 16
		});

		// --- THIS NEED TO CREATE A MARKER AT THE INDIVIDUAL USER'S ADDRESS *************
		createNormalMarkers(userLocation, map);

		// --- Thing needed so the information bubbles work
		infowindow = new google.maps.InfoWindow();

		// --- Finding places to meet in the area
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: userLocation,
			radius: 300,
			type: ['bar', 'cafe']
		}, callback);

		// --- Once we have directions, display them on the map
		directionsDisplay.setMap(map);
	}

	// --- This makes a Lettered Marker for each interesting thing
	function callback(results, status){
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i=0; i < results.length; i++) {
				createLetterMarkers(results[i]);
			}
		}
	}

	// --- Function that actually makes the Lettered Markers
	function createLetterMarkers(place){
		// --- Makes each marker
		var marker = new google.maps.Marker({
			map: map,
			label: labels[labelIndex++ % labels.length],
			position: place.geometry.location
		});

		// --- On-click listener made for each marker
		google.maps.event.addListener(marker, 'click', function() {
			// --- Figuring out Store Hours
			if (place.opening_hours) {
				if (place.opening_hours.open_now) {
					placeOpenNow = " Yes!!";
				}
				else {
					placeOpenNow = " Not right now.";
				}
			}
			// --- Displays if Google doesn't have info for this place
			else {
				placeOpenNow = " No data";
			}

			// --- Defines what appears in the information bubble
			infowindow.setContent("<h5 id='place-name'>" + place.name + "</h5><h7>" + place.vicinity + "<br>Open Now:  " + placeOpenNow + "</h7>");
			infowindow.open(map, this);

			// --- Defines our Directions request
			var request = {
				origin: userLocation,
				destination: place.geometry.location,
				travelMode: 'DRIVING'
			};

			// --- Get directions from Google
			directionsService.route(request, function(result, status) {
				if (status == "OK") {
					directionsDisplay.setDirections(result);
				}
			});
		});
	}

	// --- Function that makes the normal marker
	function createNormalMarkers(place){
		var marker = new google.maps.Marker({
			map: map,
			position: place,
		});
	}



	initMap();
}