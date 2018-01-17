$(document).ready(function() {
	var geocoder = new google.maps.Geocoder();

	$(document).on("click", "#home-address", choseHomeAddress);
	$(document).on("click","#update-address",toggleUpdate);
	$(document).on("click","#update-submit",updateAddress);
	$(document).on("click", "#current-address", choseCurrentLocation);
	$(document).on("click", "#custom-address", toggleCustom);
	$(document).on("click","#custom-submit",customAddress);



	// -- Display inputs for Updating homeAddress or using Custom Address
	function toggleUpdate(){
		$("#update-modal").modal("toggle");
	}

	function toggleCustom(){
		$("#custom-modal").modal("toggle");
	}



	// -- Functions for the 4 options
	function choseHomeAddress() {
		var url = "/api/users/home";
		setActiveLocation(url, {});
	}

	function updateAddress(){
		var newHomeAddress = $("#update-input").val().trim();
		updateHomeLocation(newHomeAddress);
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
							var url = "/api/users/currentOrCustom";
							var data = { activeLocation: results[0].formatted_address }
							setActiveLocation(url, data);
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

	function customAddress(){
		var customInput = $("#custom-input").val().trim();
		var url = "/api/users/currentOrCustom";
		var data = { activeLocation: customInput }
		setActiveLocation(url, data);
	}



	// -- PUT requests
	function updateHomeLocation(loc) {
		var data = { homeAddress: loc };
		$.ajax({
			method: "PUT",
			url: "/api/users/update",
			data: data
		})
		.done(gotoResults);
	}

	function setActiveLocation(url, data) {
		$.ajax({
			method: "PUT",
			url: url,
			data: data
		})
		.done(gotoResults);
	}

	function gotoResults() {
		window.location.href = "/results";
	}
})