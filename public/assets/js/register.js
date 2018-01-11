$(document).ready(function() {
	var currentUsernames = [];
	var usernameInput;
	var passwordInput;
	var addressInput;

	$(document).on("submit", "#new-user-form", handleNewUser);

	function handleNewUser(event) {
		event.preventDefault();

		usernameInput = $("#newUserName").val().trim();
		passwordInput = $("#newUserPass").val().trim();
		addressInput = $("#newUserAddress").val().trim();

		addNewUser({
			username: usernameInput,
			password: passwordInput,
			homeAddress: addressInput
		});
	}

	function addNewUser(userData) {
		$.post("/api/users", userData, function(data) {
			window.location.href = "/welcome";
    	});
	}
});