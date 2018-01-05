$(document).ready(function() {
	var usernameInput = $("#client-username").val().trim();
	var passwordInput = $("#client-password").val().trim();
	var addressInput = $("#client-address").val().trim();
	var currentUsernames = [];

	$(document).on("submit", "#new-user", handleNewUser);

	function getUsers() {
		$.get("api/users", function(data) {
			for (var i = 0; i < data.length; i++) {
				currentUsernames.push(data[i].username);
			}
		})
	}

	function handleNewUser(event) {
		event.preventDefault();

		getUsers();

		if (!usernameInput || !passwordInput || !addressInput) {
			console.log("tell user to fill in all fields");
			return;
		}
		else if (currentUsernames.indexOf(usernameInput) != -1) {
			console.log("tell user to choose a new username");
			return;
		}

		addNewUser({
			username: usernameInput,
			password: passwordInput,
			homeAddress: addressInput
		});
	}

	function addNewUser(userData) {
		$.post("/api/users", userData)
	}

	// somehow save the user ID of the person
}