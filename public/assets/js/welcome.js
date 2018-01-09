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
				$("#error-text").text("please fill in all fields");
				$("#message-modal").modal("toggle");
				return;
			}
			else if (currentUsernames.indexOf(usernameInput) == -1) {
				$("#error-text").text("hmm... that name doesn't exist. try again.");
				$("#message-modal").modal("toggle");
				return;
			}
			else if (passwordInput != currentPasswords[currentUsernames.indexOf(usernameInput)]) {
				$("#error-text").text("hmm... wrong password. try again.");
				$("#message-modal").modal("toggle");
				return;
			}

			window.location.href = "/location/" + (currentUsernames.indexOf(usernameInput) + 1);
		})
	}
})