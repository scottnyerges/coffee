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

		if(!usernameInput || !passwordInput || !addressInput) {
			$("#error-text").text("Please fill in all fields.");
			$("#message-modal").modal("toggle");
		}
		else {
			addNewUser({
				username: usernameInput,
				password: passwordInput,
				homeAddress: addressInput
			});
		}
	}

	function addNewUser(userData) {
		$.post("/api/users", userData, function(data, err) {
			console.log(data);
			console.log(err);
			// if (err) {
			// }
			if(data == false) {
				$("#error-text").text("That username already exists.");
				$("#message-modal").modal("toggle");
				$("#newUserName").val("");
				return;
			}
			window.location.href = "/welcome";
    	});
	}
});