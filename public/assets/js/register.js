$(document).ready(function() {
	var currentUsernames = [];
	var usernameInput;
	var passwordInput;
	var addressInput;

	console.log(window.location);

	$(document).on("submit", "#new-user-form", handleNewUser);

	function handleNewUser(event) {
		event.preventDefault();

		usernameInput = $("#newUserName").val().trim();
		passwordInput = $("#newUserPass").val().trim();
		addressInput = $("#newUserAddress").val().trim();

		console.log(usernameInput);
		console.log(passwordInput);
		console.log(addressInput);

		getUsers();
	}

	function getUsers() {
		$.get("api/users", function(data) {
			for (var i = 0; i < data.length; i++) {
				currentUsernames.push(data[i].username);
			}


			if (!usernameInput || !passwordInput || !addressInput) {
				console.log("tell user to fill in all fields");
				return;
			}
			else if (currentUsernames.indexOf(usernameInput) != -1) {
				console.log("tell user to choose a new username");
				return;
			}
			console.log("user input looks good");

			addNewUser({
				username: usernameInput,
				password: passwordInput,
				homeAddress: addressInput
			});
		})
	}

	function addNewUser(userData) {
		console.log(userData);

		$.post("/api/users", userData, function(data) {
			console.log(data);
			window.location.href = "/location/" + data.id;
    	});
	}
});