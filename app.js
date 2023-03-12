// Initialize Firebase
var firebaseConfig = {
	apiKey: "AIzaSyB-vGEOyySC4JMYdtG1Ret4pbiZLmhknLs",
	authDomain: "jeanycar-25a07.firebaseapp.com",
	databaseURL: "https://jeanycar-25a07-default-rtdb.asia-southeast1.firebasedatabase.app/",
	projectId: "jeanycar-25a07",
	storageBucket: "jeanycar-25a07.appspot.com",
	messagingSenderId: "469828085729",
	appId: "1:469828085729:web:4bc30a96b8e227f0c9d4a0",

};

firebase.initializeApp(firebaseConfig);
// Get a reference to the Firebase Realtime Database
const internetTime = Date.now();
var items = 10;
var database = firebase.database();

// Get DOM elements

var showFormButton = document.getElementById('show-form-button');
var moreButton = document.getElementById('more-button');
var notif = document.getElementById('header_notify');
var myForm = document.getElementById('postLink');
var myContent = document.getElementById('column1');
var saveButton = document.getElementById('save-button');
var cancelButton = document.getElementById('cancel-button');
var titleInput = document.getElementById('title');
var quoteTextarea = document.getElementById('quote');
var authorInput = document.getElementById('author');
var quoteTableBody = document.getElementById('quote-table-body');
var postFrom = document.getElementById('addst');

localStorage.setItem("data", internetTime);
loadDatabase(items);

let inputChanged = false;

// Show form when the "Show Form" button is clicked
showFormButton.addEventListener('click', function() {
	showFormButton.style.display = 'none';
	myContent.style.display = 'none';
	myForm.style.display = 'block';
	notif.style.display = "none";
});

// Hide form when the "Cancel" button is clicked
cancelButton.addEventListener('click', function() {
	inputChanged = false;
	myForm.style.display = 'none';
	myContent.style.display = 'block';
	showFormButton.style.display = 'block';
	postFrom.reset();
});

// Save form data to Firebase Realtime Database when the "Save" button is clicked
// Save form data to Firebase Realtime Database when the "Save" button is clicked

saveButton.addEventListener('click', function(event) {
	var title = titleInput.value;
	var quote = quoteTextarea.value;
	var author = authorInput.value;
	saveData(title, quote, author);
});






// Clear form inputs and selected row
function clearForm() {
	document.getElementById('title').value = '';
	document.getElementById('quote').value = '';
	document.getElementById('author').value = '';
	selectedRow = null;
}




function openLink(url) {
	window.open(url);
}

titleInput.addEventListener('input', function() {
	if (titleInput === '') {
		inputChanged = false;
	} else {
		inputChanged = true;
	}
});

window.addEventListener('beforeunload', function(e) {
	if (inputChanged) {
		e.preventDefault();
		e.returnValue = '';
	}
});


moreButton.addEventListener('click', function() {
	items += 5;
	loadDatabase(items);

});

function loadDatabase(itemCount) {
	database.ref('quotes').orderByChild('timestamp').limitToLast(itemCount).on('value', function(snapshot) {
		// Clear existing table rows
		quoteTableBody.innerHTML = '';
		// Generate new table rows in reverse order
		var quotes = [];
		snapshot.forEach(function(childSnapshot) {
			var childData = childSnapshot.val();
			childData.key = childSnapshot.key;
			if (childData.show ===  "true") {
				quotes.push(childData);
			}
		});

		quotes.reverse(); // Reverse the order of the quotes
		quotes.forEach(function(childData) {

			var rrow = document.createElement('tr')

			//////////////////////////////////////////////////////////


			let divStyle = "";


			if ((getTimeString(childData.timestamp)) == "Just now") {
				divStyle = "<td><div id = 'rdiv' style='background-color: cornsilk;padding:5px; border: solid 1px #ff3912;'>";
			} else {
				divStyle = "<td><div id = 'rdiv' style='background-color: white;padding:10px; border: solid 1px #ccc;'>";
			}

			let myViews = childData.views + " View" + (eval(childData.views) == 1 ? "" : "s");

			let modAuthor = childData.author;
			let myTitle = childData.title;
			let myQuote = childData.quote;
			let myAuthor = modAuthor;
			let timestamps = (childData.timestamp);

			let myTime = getTimeString(childData.timestamp);

			/////////////////////////////////////////////////////////

			rrow.innerHTML =
				divStyle + "<span style='color:#ed4c2b;'><strong>" + myAuthor +
				"</strong></span><br><em style='color:#2c94fb;word-wrap: break-word;'><small>" + myTitle +
				"</em></small><br><br><big><center><pre>" + myQuote +
				"</pre></center></big><br><small><small style='color:#808080;'><hr>" + myTime +
				"</small><br><span style='color:#008ba3;' align='center'>" + myViews + " </span></div></td>";

			/////////////////////////////////////////////////////////

			quoteTableBody.appendChild(rrow);

			// Add event listener to delete quote on row click
			// Add event listener to delete quote on row click
			rrow.addEventListener("click", function() {
				// Create modal with delete button and close button

				var counter = false;
				var modal = document.createElement('div');


				let myAuthor = "<strong style='color:#ed4c2b;'>" + childData.author + "</strong>";
				let myTitle = "<em style='color:#2c94fb;word-wrap: break-word;'>" + childData.title + "</em>";
				let tinyMargin = "<small><small><br><br></small></small>";
				let myViews = "<span style='color:#808080'>" + childData.views + " visits | " + childData.views + " views</span>";

				let dButton = "<br><a class='delete-button'>Delete</a>";
				let vButton = "<button class='view-button'>VISIT</button>";

				modal.innerHTML = "<center><div><p>" + myAuthor + "<br>" + myTitle + tinyMargin +
					"</div></div><br><br>" + vButton + dButton + "<div class='close-button'></div>";

				modal.style.position = 'fixed';
				modal.style.top = '36%';
				modal.style.left = '50%';
				modal.style.width = '300px';
				modal.style.height = 'auto';
				modal.style.transform = 'translate(-50%, -50%)';

				modal.style.backgroundColor = 'white';

				modal.style.padding = '20px';
				modal.style.border = '1px #aaa';
				modal.style.borderRadius = '10px';
				modal.style.zIndex = '9999';

				// Style close button
				var closeButton = modal.querySelector('.close-button');
				closeButton.style.position = 'absolute';
				closeButton.style.top = '108%';
				closeButton.style.left = '44%';
				closeButton.style.fontSize = '35px';
				
				closeButton.style.color = 'rgba(0, 0, 0, 0)';
				closeButton.style.cursor = 'pointer';

				closeButton.style.background = 'transparent'; // remove the background image property
				closeButton.innerHTML = '<div class="circle"><span class="fas fa-times"></span></div>'; // wrap the X icon inside a div element with a class name for the circle
				closeButton.style.fontSize = '35px';
				closeButton.style.cursor = 'pointer';



				// Add overlay with grey background
				var overlay = document.createElement('div');
				overlay.style.position = 'fixed';
				overlay.style.top = '0';
				overlay.style.left = '0';
				overlay.style.width = '100%';
				overlay.style.height = '100%';
				overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.82)';
				overlay.style.zIndex = '9998';

				// Add event listener to close button
				closeButton.addEventListener('click', function() {
					modal.remove();
					overlay.remove();
				});


				var viewButton = modal.querySelector('.view-button');
				viewButton.style.marginTop = '5px';
				viewButton.style.marginBottom = '15px';

				viewButton.style.fontWeight = 'bold';
				viewButton.style.borderRadius = '15px';
				viewButton.style.width = '200px';

				var deleteButton = modal.querySelector('.delete-button');

				deleteButton.style.color = '#ccc';
				deleteButton.style.cursor = 'pointer';

				viewButton.addEventListener('click', function() {
					openLink(childData.title);
					database.ref('quotes/' + childData.key).update({
						views: eval(childData.views) + eval(1)
					});
				});

				closeButton.addEventListener('click', function() {
					modal.remove();
					overlay.remove();
				});

				// Delete quote from database when delete button is clicked
				deleteButton.addEventListener('click', function() {

					if (!counter) {
						deleteButton.innerHTML = "&#x2713; Confirm";
						counter = true;
					} else {

						database.ref('quotes/' + childData.key).update({
							show: 'false'
						});

						modal.remove();
						overlay.remove();
						notif.style.display = "none";

					}

				});

				// Add modal and overlay to the page
				document.body.appendChild(modal);
				document.body.appendChild(overlay);
			});

		});

	}, function(error) {
		console.error("Failed to retrieve quotes:", error);
		if (error.code === "PERMISSION_DENIED") {
			//alert("You don't have permission to save quotes.");
			notif.innerHTML = "Database is locked";
		} else if (error.code === "NETWORK_ERROR") {
			//alert("No internet connection. Please check your network settings and try again.");
			notif.innerHTML = "No internet connection.";
		} else {
			//alert("Failed to save quote. Please try again later.");
			notif.innerHTML = "Failed to save link.";
		}
	});


}


function saveData(title, quote, author) {
	inputChanged = false;
	saveButton.disabled = true;

	if (title === '' || author === '') {
		saveButton.disabled = false;
	} else {
		var lineBreakCount = (quote.match(/\n/g) || []).length;
		if (lineBreakCount > 5) {
			saveButton.disabled = false;
			quoteTextarea.setCustomValidity("Too many line breaks");
		} else {
			event.preventDefault();
			
			if (quote.length > 100) {
				quote = quote.substring(0, 100);
			}

			if (title.length > 80) {
				title = title.substring(0, 80);
			}

			if (author.length > 50) {
				author = author.substring(0, 50);
			}

			// Save form data to Firebase Realtime Database
			if (navigator.onLine) {
				
				var quoteRef = database.ref('quotes').push();
				quoteRef.set({
					title: title,
					quote: quote,
					author: author,
					sessionkey: internetTime,
					show: "true",
					views: "0",
					visits: "0",
					timestamp: firebase.database.ServerValue.TIMESTAMP
				}, function(error) {
					if (error) {
						console.error("Failed to save quote:", error);
						notif.style.display = "block";


						if (error.code === "PERMISSION_DENIED") {
							//alert("You don't have permission to save quotes.");
							notif.innerHTML = "Database is locked";
						} else if (error.code === "NETWORK_ERROR") {
							//alert("No internet connection. Please check your network settings and try again.");
							notif.innerHTML = "No internet connection.";
						} else {
							//alert("Failed to save quote. Please try again later.");
							notif.innerHTML = "Failed to save link.";
						}
					} else {
						myForm.style.display = 'none';
						postFrom.reset();
						showFormButton.style.display = 'block';
						myContent.style.display = 'block';
						notif.style.display = "block";
						notif.innerHTML = "Link saved!";
						saveButton.disabled = false;
					}

				});

			} else {
				notif.style.display = "block";
				notif.innerHTML = "No Connection";
			}


		}

	}
}


function loadData(item) {
	var data = localStorage.getItem(item);
	if (data) {
		return data;
	} else {
		return 0;
	}
}