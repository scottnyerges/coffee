$(document).ready(function() {
	var groupAddresses = [];
	var userAddress;

	var url = window.location.href;
	var index = url.split("results/")[1];

	$(document).on("click", "#logoff", goOffline);

	$.get("../api/users/" + index, function(data) {
		userAddress = data.activeLocation;
		console.log("this users address is " + userAddress);
		geocoder.geocode({ "address": userAddress}, function(results, status) {
			if (status == "OK") {
				userLocation = results[0].geometry.location;
			}
		})

	})


	$.get("../api/users/online", function(data) {
		var onlineUsers = "";
		for(var i = 0; i < data.length; i++) {
			groupAddresses.push(data[i].activeLocation);
			onlineUsers += data[i].username;
			onlineUsers += "<br>";
		}
		$("#users-online").html(onlineUsers);
		console.log(groupAddresses);
		addressToLatLng();
	});





	//----------------------------------Google Maps stuff
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var bound = new google.maps.LatLngBounds();
	var map;
	var geocoder = new google.maps.Geocoder();
	var userLocation;
	var centerLocation;
	var k = 0;


	// --- Whenever the map is loaded...
	function initMap() {
		// --- Thing needed for directions to display properly
		directionsDisplay = new google.maps.DirectionsRenderer();



		// --- Defining the map
		map = new google.maps.Map(document.getElementById('map'), {
			center: centerLocation,
			zoom: 16
		});

		// --- THIS NEED TO CREATE A MARKER AT THE INDIVIDUAL USER'S ADDRESS *************
		createNormalMarkers(userLocation);

		// --- Thing needed so the information bubbles work
		infowindow = new google.maps.InfoWindow();

		// --- Finding places to meet in the area
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: centerLocation,
			radius: 400,
			type: ['bar', 'cafe']
		}, callback);

		// --- Once we have directions, display them on the map
		directionsDisplay.setMap(map);
	}

	// --- This makes a Lettered Marker for each interesting thing
	function callback(results, status){
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i=0; i < 20; i++) {
				createLetterMarkers(results[i]);
			}
		}
	}

	// --- Geocode addresses into LatLng
	function addressToLatLng() {
		geocoder.geocode({ "address": groupAddresses[k]}, function(results, status) {
			if (status == "OK") {
				bound.extend(results[0].geometry.location);
				k++;

				if (k < groupAddresses.length) {
					addressToLatLng();
				}
				else {
					centerLocation = bound.getCenter();
					initMap();
				}
			}
		})
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
					placeOpenNow = " Definitely Yes";
				}
				else {
					placeOpenNow = " Nope, sorry.";
				}
			}
			// --- Displays if Google doesn't have info for this place
			else {
				placeOpenNow = " Possibly, not sure";
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


	function goOffline(event) {
		event.preventDefault();
		var data = { id: index, online: false, activeLocation: null };
		$.ajax({
			method: "PUT",
			url: "/api/users",
			data: data
		})
		.done(function() {
			window.location.href = "/welcome";
		});
	}
})



