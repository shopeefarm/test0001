var firebaseConfig = {
	apiKey: "AIzaSyB-vGEOyySC4JMYdtG1Ret4pbiZLmhknLs",
	authDomain: "jeanycar-25a07.firebaseapp.com",
	databaseURL: "https://jeanycar-25a07-default-rtdb.asia-southeast1.firebasedatabase.app/",
	projectId: "jeanycar-25a07",
	storageBucket: "jeanycar-25a07.appspot.com",
	messagingSenderId: "469828085729",
	appId: "1:469828085729:web:4bc30a96b8e227f0c9d4a0"
};
firebase.initializeApp(firebaseConfig);
const internetTime = Date.now();
var items = 10,
	database = firebase.database(),
	showFormButton = document.getElementById("show-form-button"),
	moreButton = document.getElementById("more-button"),
	notif = document.getElementById("header_notify"),
	myForm = document.getElementById("postLink"),
	myContent = document.getElementById("column1"),
	saveButton = document.getElementById("save-button"),
	cancelButton = document.getElementById("cancel-button"),
	titleInput = document.getElementById("title"),
	quoteTextarea = document.getElementById("quote"),
	authorInput = document.getElementById("author"),
	quoteTableBody = document.getElementById("quote-table-body"),
	postFrom = document.getElementById("addst");
localStorage.setItem("data", internetTime);
const loading = document.querySelector("#loading-page");
loading.style.display = "flex", loadDatabase(items);
let inputChanged = !1;

function clearForm() {
	document.getElementById("title").value = "", document.getElementById("quote").value = "", document.getElementById("author").value = "", selectedRow = null
}

function openLink(e) {
	window.open(e)
}

function loadDatabase(itemCount) {
	database.ref("quotes").orderByChild("timestamp").limitToLast(itemCount).on("value", (function(snapshot) {
		quoteTableBody.innerHTML = "";
		var quotes = [];
		snapshot.forEach((function(e) {
			var t = e.val();
			t.key = e.key, "true" === t.show && quotes.push(t)
		})), quotes.reverse(), quotes.forEach((function(childData) {
			var rrow = document.createElement("tr");
			let divStyle = "";
			divStyle = "Just now" == getTimeString(childData.timestamp) ? "<td><div id = 'rdiv' style='background-color: cornsilk;padding:5px; border: solid 1px #ff3912;'>" : "<td><div id = 'rdiv' style='background-color: white;padding:10px; border: solid 1px #ccc;'>";
			let myViews = childData.views + " View" + (1 == eval(childData.views) ? "" : "s"),
				modAuthor = childData.author,
				myTitle = childData.title,
				myQuote = childData.quote,
				myAuthor = modAuthor,
				timestamps = childData.timestamp,
				myTime = getTimeString(childData.timestamp);
			rrow.innerHTML = divStyle + "<span style='color:#ed4c2b;'><strong>" + myAuthor + "</strong></span><br><em style='color:#2c94fb;word-wrap: break-word;'><small>" + myTitle + "</em></small><br><br><big><center><pre>" + myQuote + "</pre></center></big><br><small><small style='color:#808080;'><hr>" + myTime + "</small><br><span style='color:#008ba3;' align='center'>" + myViews + " </span></div></td>", quoteTableBody.appendChild(rrow), rrow.addEventListener("click", (function() {
				var counter = !1,
					modal = document.createElement("div");
				let myAuthor = "<strong style='color:#ed4c2b;'>" + childData.author + "</strong>",
					myTitle = "<em style='color:#2c94fb;word-wrap: break-word;'>" + childData.title + "</em>",
					tinyMargin = "<small><small><br><br></small></small>",
					myViews = "<span style='color:#808080'>" + childData.views + " visits | " + childData.views + " views</span>",
					dButton = "<br><a class='delete-button'>Delete</a>",
					vButton = "<button class='view-button'>VISIT</button>";
				modal.innerHTML = "<center><div><p>" + myAuthor + "<br>" + myTitle + tinyMargin + "</div></div><br><br>" + vButton + dButton + "<div class='close-button'></div>", modal.style.position = "fixed", modal.style.top = "36%", modal.style.left = "50%", modal.style.width = "300px", modal.style.height = "auto", modal.style.transform = "translate(-50%, -50%)", modal.style.backgroundColor = "white", modal.style.padding = "20px", modal.style.border = "1px #aaa", modal.style.borderRadius = "10px", modal.style.zIndex = "9999";
				var closeButton = modal.querySelector(".close-button");
				closeButton.style.position = "absolute", closeButton.style.top = "108%", closeButton.style.left = "44%", closeButton.style.fontSize = "35px", closeButton.style.cursor = "pointer", closeButton.style.background = "transparent", closeButton.innerHTML = '<div class="circle"><span><big><big>&times;</span></div>', closeButton.style.fontSize = "35px", closeButton.style.cursor = "pointer";
				var overlay = document.createElement("div");
				overlay.style.position = "fixed", overlay.style.top = "0", overlay.style.left = "0", overlay.style.width = "100%", overlay.style.height = "100%", overlay.style.backgroundColor = "rgba(0, 0, 0, 0.82)", overlay.style.zIndex = "9998", closeButton.addEventListener("click", (function() {
					modal.remove(), overlay.remove()
				}));
				var viewButton = modal.querySelector(".view-button");
				viewButton.style.marginTop = "5px", viewButton.style.marginBottom = "15px", viewButton.style.fontWeight = "bold", viewButton.style.borderRadius = "15px", viewButton.style.width = "200px";
				var deleteButton = modal.querySelector(".delete-button");
				deleteButton.style.color = "#ccc", deleteButton.style.cursor = "pointer", viewButton.addEventListener("click", (function() {
					openLink(childData.title), database.ref("quotes/" + childData.key).update({
						views: eval(childData.views) + eval(1)
					})
				})), closeButton.addEventListener("click", (function() {
					modal.remove(), overlay.remove()
				})), deleteButton.addEventListener("click", (function() {
					counter ? (database.ref("quotes/" + childData.key).update({
						show: "false"
					}), modal.remove(), overlay.remove(), notif.style.display = "none") : (deleteButton.innerHTML = "&#x2713; Confirm", counter = !0)
				})), document.body.appendChild(modal), document.body.appendChild(overlay)
			})), loading.style.display = "none"
		}))
	}), (function(e) {
		console.error("Failed to retrieve quotes:", e), "PERMISSION_DENIED" === e.code ? notif.innerHTML = "Database is locked" : "NETWORK_ERROR" === e.code ? notif.innerHTML = "No internet connection." : notif.innerHTML = "Failed to save link."
	}))
}

function saveData(e, t, o) {
	(inputChanged = !1, saveButton.disabled = !0, "" === e || "" === o) ? saveButton.disabled = !1: (t.match(/\n/g) || []).length > 5 ? (saveButton.disabled = !1, quoteTextarea.setCustomValidity("Too many line breaks")) : (event.preventDefault(), t.length > 100 && (t = t.substring(0, 100)), e.length > 80 && (e = e.substring(0, 80)), o.length > 50 && (o = o.substring(0, 50)), navigator.onLine ? database.ref("quotes").push().set({
		title: e,
		quote: t,
		author: o,
		sessionkey: internetTime,
		show: "true",
		views: "0",
		visits: "0",
		timestamp: firebase.database.ServerValue.TIMESTAMP
	}, (function(e) {
		e ? (console.error("Failed to save quote:", e), notif.style.display = "block", "PERMISSION_DENIED" === e.code ? notif.innerHTML = "Database is locked" : "NETWORK_ERROR" === e.code ? notif.innerHTML = "No internet connection." : notif.innerHTML = "Failed to save link.") : (myForm.style.display = "none", postFrom.reset(), showFormButton.style.display = "block", myContent.style.display = "block", notif.style.display = "block", notif.innerHTML = "Link saved!", saveButton.disabled = !1)
	})) : (notif.style.display = "block", notif.innerHTML = "No Connection"))
}

function loadData(e) {
	var t = localStorage.getItem(e);
	return t || 0
}
showFormButton.addEventListener("click", (function() {
	showFormButton.style.display = "none", myContent.style.display = "none", myForm.style.display = "block", notif.style.display = "none"
})), cancelButton.addEventListener("click", (function() {
	inputChanged = !1, myForm.style.display = "none", myContent.style.display = "block", showFormButton.style.display = "block", postFrom.reset()
})), saveButton.addEventListener("click", (function(e) {
	saveData(titleInput.value, quoteTextarea.value, authorInput.value)
})), titleInput.addEventListener("input", (function() {
	inputChanged = "" !== titleInput
})), window.addEventListener("beforeunload", (function(e) {
	inputChanged && (e.preventDefault(), e.returnValue = "")
})), moreButton.addEventListener("click", (function() {
	loadDatabase(items += 5)
}));
