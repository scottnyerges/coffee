$(document).ready(function() {

	$(document).on("click", "#home-address", choseHomeAddress);
	$(document).on("click", "#current-address", choseCurrentLocation);
	$(document).on("click", "#custom-address", choseCustom);
	$(document).on("submit", "#custom-address", handleCustomAddress);

	function choseHomeAddress() {
		// get the id of the user who logged in and find their address
		// save that address
	}

	function choseCurrentLocation() {
		// fancy google Maps shit
		// save that maps thing
	}

	function choseCustom() {
		// turn modal thing on
		var userAddress = $("#custom-input").val().trim();
	}
}