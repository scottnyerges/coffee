$(document).ready(function() {
	var usernameInput;
	var passwordInput;
	var currentUsernames = [];
	var currentPasswords = [];

	$(document).on("submit", "#myForm", handleSignIn);

	function handleSignIn(event) {
		event.preventDefault();

		usernameInput = $("#userName").val().trim();
		passwordInput = $("#userPass").val().trim();

		getUsers();
	}

	function getUsers() {
		$.get("api/users", function(data) {
			for (var i = 0; i < data.length; i++) {
				currentUsernames.push(data[i].username);
				currentPasswords.push(data[i].password);
			}

			if (!usernameInput || !passwordInput) {
				console.log("tell user to fill in all fields");
				return;
			}
			else if (currentUsernames.indexOf(usernameInput) == -1) {
				console.log("tell user that their username doesnt exist");
				return;
			}
			else if (passwordInput != currentPasswords[currentUsernames.indexOf(usernameInput)]) {
				console.log("tell the user the passwords dont match");
				return;
			}
			console.log("Credentials worked");

			window.location.href = "/location/" + (currentUsernames.indexOf(usernameInput) + 1);
		})
	}
})