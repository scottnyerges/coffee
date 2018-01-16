$(document).ready(function() {
	// ----- VARIABLES
	// -- firebase
	var config = {
		apiKey: "AIzaSyDrwFzYNLjQEOMp5qNw0ISjOQOwHMq9XIQ",
		authDomain: "groupproject2-31ab2.firebaseapp.com",
		databaseURL: "https://groupproject2-31ab2.firebaseio.com",
		projectId: "groupproject2-31ab2",
		storageBucket: "groupproject2-31ab2.appspot.com",
		messagingSenderId: "1094329325836"
	};
	firebase.initializeApp(config);
	var database = firebase.database();
	var chatData = database.ref("/chat");
	var groupRef = database.ref("/group");
	var playerRef;

	// -- Google Maps stuff
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var bound;
	var map;
	var geocoder = new google.maps.Geocoder();
	var userLocation;
	var centerLocation;
	var k = 0;
	var service;

	// Other stuff
	$("#reviewsBox").hide();
	var groupAddresses = [];
	var userAddress;
	var username;
	var url = window.location.href;
	var index = url.split("results/")[1];
	var didFirebaseLoadTheMapOnStartup = false;
	var firstSearchDone;
	var didUserPressLogOut = false;


	// ----- FUNCTIONS/API requests
	// -- GET user info from database and add to list of active locations
	$.get("../api/thisUser", function(data) {
		username = data.username;
		userAddress = data.activeLocation;
		geocoder.geocode({ "address": userAddress}, function(results, status) {
			if (status == "OK") {
				userLocation = results[0].geometry.location;
			}
		})

		// Firebase listening for new users
		groupRef.on("value", function(snapshot) {
			console.log("firebase noticed a new user");
			displayResults();
		});

		// Add them to list of users on Firebase
		playerRef = database.ref("/group/" + index);
		playerRef.set({
			name: username
		});

		// Load chat box 
		chatData.orderByChild("time").on("child_added", function(snapshot) {
			$("#chat-messages").append("<p class=player" + snapshot.val().idNum + "><span>" + snapshot.val().name + "</span>: " + snapshot.val().message + "</p>");
			$("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
		});

		// Update Chat to say user connected
		var chatConnect = database.ref("/chat/" + Date.now());
		chatConnect.set({
			name: username,
			time: firebase.database.ServerValue.TIMESTAMP,
			message: "is now online!",
			idNum: 0
		});
	})

	// -- Prep to display results on screen
	function displayResults() {
		console.log("displayResults");
		// GET list of online users and their active locations
		$.get("../api/users/online", function(data) {
			console.log(JSON.stringify(data));
			var onlineUsers = "";
			groupAddresses = [];
			for(var i = 0; i < data.length; i++) {
				groupAddresses.push(data[i].activeLocation);
				onlineUsers += data[i].username;
				onlineUsers += "<br>";
			}
			$("#users-online").html(onlineUsers);

			console.log(groupAddresses);

			// Resetting these variables so addressToLatLng can be ran recursively
			k = 0;
			bound = new google.maps.LatLngBounds();
			addressToLatLng();
		});
	}

	// -- Geocode addresses into LatLng and find center
	function addressToLatLng() {
		console.log("addressToLatLng");
		console.log(groupAddresses);
		console.log(groupAddresses[k]);
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

	// -- Update the map
	function initMap() {
		console.log("initMap");
		directionsDisplay = new google.maps.DirectionsRenderer();

		map = new google.maps.Map(document.getElementById('map'), {
			center: centerLocation,
			zoom: 15
		});

		createNormalMarkers(userLocation);

		service = new google.maps.places.PlacesService(map);
		firstSearchDone = false;
		findPlaces("cafe");

		directionsDisplay.setMap(map);
	}

	function findPlaces(type) {
		service.nearbySearch({
			location: centerLocation,
			radius: 500,
			type: [type]
		}, callback);
	}

	// -- This makes a Lettered Marker for each coffee shop thing
	function callback(results, status){
		console.log("callback (after finding Places");
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			var j = 0;
			for (var i=0; j < 6 && i < results.length; i++) {
				if ((!firstSearchDone) || (firstSearchDone && results[i].types.indexOf("cafe") == -1)) {
					j++;
					createLetterMarkers(results[i]);
				}
			}
			if (!firstSearchDone) {
				firstSearchDone = true;
				findPlaces("bar");
			}
		}
	}

	// -- Function that actually makes the Lettered Markers
	function createLetterMarkers(place){
		console.log("createLetterMarkers");
		var marker = new google.maps.Marker({
			map: map,
			label: labels[labelIndex++ % labels.length],
			position: place.geometry.location
		});

		//  On-click listener made for each marker
		google.maps.event.addListener(marker, 'click', function() {
			// Figuring out Store Hours
			if (place.opening_hours) {
				if (place.opening_hours.open_now) {
					placeOpenNow = " Definitely Yes";
				}
				else {
					placeOpenNow = " Nope, sorry";
				}
			}
			// Displays if Google doesn't have info for this place
			else {
				placeOpenNow = " Possibly, not sure";
			}

			if(place.rating) {
				placeRating = place.rating;
			}
			else {
				placeRating = "Has not been reviewed";
			}

			var url = "https://www.google.com/maps/dir/?api=1";
			var origin = "&origin=" + spacesToPlus(userAddress);
			var destination = "&destination=" + spacesToPlus(place.vicinity);
			var newUrl = url + origin + destination;

			// Update page with clicked location's info
			$("#loc-name").text("Name: " + place.name);
            $("#loc-address").text("Address: " + place.vicinity);
            $("#loc-rating").text("Rating: " + placeRating);
            $("#loc-open").text("Open Now: " + placeOpenNow);
            $("#loc-directions").attr("href", newUrl);
            $("#reviewsBox").show();

			// Defines our Directions request
			var request = {
				origin: userLocation,
				destination: place.geometry.location,
				travelMode: 'DRIVING'
			};

			// Get directions from Google
			directionsService.route(request, function(result, status) {
				if (status == "OK") {
					directionsDisplay.setDirections(result);
				}
			});
		});
	}

	// -- Function that makes the normal marker on the user's location
	function createNormalMarkers(place){
		var marker = new google.maps.Marker({
			map: map,
			position: place,
		});
	}



	// -- The next two listeners are for if the user clicks the Chat button or presses Enter while typing
	$("#chat-send").click(function() {
		if ($("#chat-input").val() !== "") {
			postToChat()
		}
	});
	$("#chat-input").keypress(function(e) {
		if (e.keyCode === 13 && $("#chat-input").val() !== "") {
			postToChat()
		}
	});

	function postToChat() {
		var message = $("#chat-input").val();

		chatData.push({
			name: username,
			message: message,
			time: firebase.database.ServerValue.TIMESTAMP,
			idNum: 1
		});

		$("#chat-input").val("");
	}



	// -- Logging the user off
	function goOffline(event) {
		event.preventDefault();

	    playerRef.onDisconnect().remove();

		var chatDisconnect = database.ref("/chat/" + Date.now());
	    chatDisconnect.onDisconnect().set({
	      name: username,
	      time: firebase.database.ServerValue.TIMESTAMP,
	      message: "has disconnected.",
	      idNum: 0
	    });

		$.ajax({
			method: "PUT",
			url: "/api/users/logout"
		})
		.done(function() {
			if(didUserPressLogOut) {
				window.location.href = "/logout";
			}
		});
	}



	// -- Convert Spaces to Pluses for GMaps
	var spacesToPlus = function(text) {
		var newText = "";
		for (var i = 0; i < text.length; i++) {
			if (text[i] == " ") {
				newText += "+";
			}
			else {
				newText += text[i];
			}
		}
		return newText;
	};

	$(window).on("beforeunload", goOffline);

	$(document).on("click", "#logoff", function(event) {
		didUserPressLogOut = true;
		goOffline(event);
	});
})