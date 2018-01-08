$(document).ready(function() {
	var geocoder = new google.maps.Geocoder();

	$(document).on("click", "#home-address", choseHomeAddress);
	$(document).on("click", "#change-home", choseChangeHome);
	$(document).on("click", "#current-address", choseCurrentLocation);
	$(document).on("click", "#custom-address", choseCustom);



	var url = window.location.href;
	console.log(url);
	var index = url.split("location/")[1];
	console.log("index is " + index);

	function choseHomeAddress() {
		$.get("../api/users/" + index, function(data) {
			updateActiveLocation(data.homeAddress);
		})
	}

	function choseChangeHome() {
		var newHome = $("#new-home").val().trim();
		var data = { id: index, homeAddress: newHome };
		$.ajax({
			method: "PUT",
			url: "/api/users",
			data: data
		})
		.done(function() {
			updateActiveLocation(newHome);
		});
	}

	function choseCurrentLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				console.log(position);
				var latlng = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				geocoder.geocode({'location': latlng}, function(results, status) {
					if (status === 'OK') {
						if (results[0]) {
							updateActiveLocation(results[0].formatted_address);
						} else {
							console.log('No results found');
						}
					} else {
						console.log('Geocoder failed due to: ' + status);
					}
				});
			}, function() {
					console.log("User Blocked Location Services");
					return;
				});
		} else {
			console.log("User doesn't have Location Services available");
			return;
		}
	}

	function choseCustom() {
		var userAddress = $("#custom-input").val().trim();
		updateActiveLocation(userAddress);
	}


	function updateActiveLocation(loc) {
		var data = { id: index, online: true, activeLocation: loc };
		console.log(data);
		$.ajax({
			method: "PUT",
			url: "/api/users",
			data: data
		})
		.done(function() {
			window.location.href = "/results/" + index;
		});
	}
})