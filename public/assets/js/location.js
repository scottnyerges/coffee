$(document).ready(function() {

	$(document).on("click", "#home-address", choseHomeAddress);
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

	function choseCurrentLocation() {
		// fancy google Maps shit
		// save that maps thing
	}

	function choseCustom() {
		var userAddress = $("#custom-input").val().trim();
		updateActiveLocation(userAddress);
	}


	function updateActiveLocation(loc) {
		var data = { id: index, online: true, activeLocation: loc };
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