$(document).ready(function() {
	var usernameInput = $("#client-username").val().trim();
	var passwordInput = $("#client-password").val().trim();
	var currentUsernames = [];
	var currentPasswords = [];

	$(document).on("submit", "#sign-in", handleSignIn);

	function getUsers() {
		$.get("api/users", function(data) {
			for (var i = 0; i < data.length; i++) {
				currentUsernames.push(data[i].username);
				currentPasswords.push(data[i].password);
			}
		})
	}

	function handleSignIn(event) {
		event.preventDefault();

		getUsers();

		if (!usernameInput || !passwordInput) {
			// tell user to fill in all fields
			return;
		}
		else if (currentUsernames.indexOf(usernameInput) == -1) {
			// tell user that their username doesnt exist
			return;
		}
		else if (passwordInput != currentPasswords[currentUsernames.indexOf(usernameInput)]) {
			// tell the user the passwords dont match
			return;
		}
	}

	// somehow save the user ID of the person
}