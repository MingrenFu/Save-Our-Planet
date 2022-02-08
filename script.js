var app = {

  OWMURL: "https://api.openweathermap.org/data/2.5/weather?q=",
  BMURL: "https://api.breezometer.com/air-quality/v2/current-conditions?lat=",
  SDBURL: "https://sheetdb.io/api/v1/rvkpiecmiuupu",

  personTemplate: '<div class="entry">{{Name}} {{Email}} {{Number}} {{Comment}}</div>',



	initialize: function() {
		$("#search").click(function(){
			console.log("Clicked search");
			$("#city_picture").html("");
			$("#city_name").html("");
			$("#number").html("");
			var searchLocation = $("#search_input").val();
			console.log(searchLocation);
			app.getCoordinate(searchLocation);
		}),

		$("body").keypress(function(e){
			//If enter key is pressed
			if (e.which == 13){
				$("#search").trigger('click');
			}
		});


    // app.attachListeners();
	},

  formsubmission: function(){
    document.getElementById('submit_btn').addEventListener('click', () => {
      this.checkContent();
      // this.submitInfo();
    });
  },

	getCoordinate: function(searchLocation) {
		var weatherMapCustomURL = app.OWMURL + searchLocation + '&APPID=';
		var myWeatherKey = '7f7dc5b4443164df03ddb47abcd74562';
		var weatherMapReqURL = weatherMapCustomURL + myWeatherKey;
		console.log(weatherMapReqURL);

		fetch (weatherMapReqURL)
		.then(response => response.json())
		.then(data => {
      console.log(data);
      let latitude = data.coord.lat;
      let longitude = data.coord.lon;
      let sLocation = data.name;
      let lLocation = data.sys.country;
      // let weather = data.weather[0].description;
      let weather1 = data.weather[0].icon;
      let weather2 = data.weather[0].main;
      // let weatherName = data.weather[0].main;
      console.log (latitude, longitude, sLocation, lLocation, weather1, weather2);
      app.getAirQuality(latitude, longitude, sLocation, lLocation, weather1, weather2);})
		.catch(error => console.log(error))
	},

  getAirQuality: function(latitude, longitude, sLocation, lLocation, weather1, weather2) {
    var breezoMeterCustomURL = app.BMURL + `${latitude}&lon=${longitude}` + '&features=breezometer_aqi,local_aqi,health_recommendations' + '&key=';
    var myBreezoMeterKey = '3e794104a3214a0ca7ea66395264f29d';
    var breezoMeterReqURL = breezoMeterCustomURL + myBreezoMeterKey;
    var city = sLocation;
    var country = lLocation;
    var weather1 = weather1;
    var weather2 = weather2;

    fetch (breezoMeterReqURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let content = data.data.indexes.baqi.aqi_display;
      let color = data.data.indexes.baqi.color;
      console.log (content, color, city, country);
      // debugger;
      app.displayResult(content, color, city, country, weather1, weather2);})
    .catch(error => console.log(error))
    // debugger;
    // let bookImage = content[0].book_image;
    // let bookTitle = content[0].title;
    // let bookDescription = content[0].description;
    // $("#book_image").html(`<img id="book_cover" src="${bookImage}"></img>`);
    // $("#book_title").html(`<p>${bookTitle}</p>`);
    // $("#book_description").html(`<p>${bookDescription}</p>`);
    // console.log ("success!");
  // },
},

displayResult: function(content, color, city, country, weather1, weather2) {
let aqi = content;
var textColor = color;
let city1 = city;
let country1 = country;

// let bookImage = content[0].book_image;
// let bookTitle = content[0].title;
// let bookDescription = content[0].description;

$("#number").html(`<p>${aqi}</p>`);
$("#number").css('color', textColor);
$("#city_name").html(`<p>${city1}, ${country1}</p>`)
$("#city_condition").html(`<img style="-webkit-filter: drop-shadow(-3px 5px 10px #555555); filter: drop-shadow(-3px 5px 10px #555555); position: relative; bottom: 45px;"src="http://openweathermap.org/img/wn/${weather1}@2x.png"></img>`)
$("#city_condition").append(`<p>${weather2}</p>`)
// $("#city_condition").html(`<img src="http://openweathermap.org/img/wn/${weather}@2x.png"></img>`)

// -webkit-filter: drop-shadow(5px 5px 5px #222222);
// filter: drop-shadow(5px 5px 5px #222222);

// $("#book_title").html(`<p>${bookTitle}</p>`);
// $("#book_description").html(`<p>${bookDescription}</p>`);
// console.log ("success!");
},

// initialize: function() {
// $("#solution_button").click(function(){
//   app.displayWindow();
// }),
// },
// // document.getElementById('solution_button').addEventListener(“click”, openPopup);
//
// displayWindow: function (){
  // document.getElementById('popup').style.display = "block";
  // console.log("success")
// },

submitInfo: function() {
  const data = {
  Name: $('#userName').val(),
  Email: $('#email').val(),
  Number: $('#contactNumber').val(),
  Comment: $('#comment').val(),
}
 const requestBody = {data: [data]}

 fetch(app.SDBURL, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(requestBody)
 })
 .then(response => response.json())
 .then(response => {
   // app.getTheData();
   console.log(response);
 })

},

checkContent: function() {
    let username = document.getElementById("userName").value;
    // let lastname = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let comment = document.getElementById("comment").value;
    if (username !== '' && email !== '' && app.validateEmail(email) == true && comment !== '') {
      document.getElementById("submit_btn").style.display = "none";
      const element1 = document.getElementById("loading_animation");
      element1.classList.add("loader");
      setTimeout(function(){ document.getElementById("post_submit").classList.add("submit_message"); element1.classList.remove("loader"); }, 3000);
      let userNameBox = document.getElementById("userName");
      // let lastNameBox = document.getElementById("lastName");
      let emailBox = document.getElementById("email");
      let commentBox = document.getElementById("comment");

      let nameLabel = document.getElementById("nameNote");
      let emailLabel = document.getElementById("emailNote");
      let commentLabel = document.getElementById("commentNote");
      userNameBox.classList.remove("redFormInput");
      emailBox.classList.remove("redFormInput");
      commentBox.classList.remove("redFormInput2");

      nameLabel.classList.remove("nameErrorLabel");
      emailLabel.classList.remove("emailErrorLabel");
      commentLabel.classList.remove("commentErrorLabel");
      console.log ("Valid Content");
      setTimeout(function(){ window.location.replace("contact.html"); }, 5000);
      this.submitInfo();
    }
    else {
      const element1 = document.getElementById("loading_animation");
      element1.classList.remove("loader");
      if (username == '') {
        let userNameBox = document.getElementById("userName");
        let nameLabel = document.getElementById("nameNote");
        userNameBox.classList.add("redFormInput");
        nameLabel.classList.add("nameErrorLabel");
      }
      if (username !== '') {
        let userNameBox = document.getElementById("userName");
        let nameLabel = document.getElementById("nameNote");
        userNameBox.classList.remove("redFormInput");
        nameLabel.classList.remove("nameErrorLabel");
      }

      if (email == '') {
        let emailBox = document.getElementById("email");
        let emailLabel = document.getElementById("emailNote");
        emailBox.classList.add("redFormInput");
        emailLabel.classList.add("emailErrorLabel");
      }
      if (email !== '') {
        if (app.validateEmail(email) == false) {
          let emailLabel = document.getElementById("emailNote");
          emailLabel.classList.add("emailErrorLabel");
          let emailBox = document.getElementById("email");
          emailBox.classList.add("redFormInput");
        } else {
          let emailBox = document.getElementById("email");
          let emailLabel = document.getElementById("emailNote");
          emailBox.classList.remove("redFormInput");
          emailLabel.classList.remove("emailErrorLabel");
        }
      }

      if (comment == '') {
        let commentBox = document.getElementById("comment");
        let commentLabel = document.getElementById("commentNote");
        commentBox.classList.add("redFormInput2");
        commentLabel.classList.add("commentErrorLabel");
      }
      if (comment !== '') {
        let commentBox = document.getElementById("comment");
        let commentLabel = document.getElementById("commentNote");
        commentBox.classList.remove("redFormInput2");
        commentLabel.classList.remove("commentErrorLabel");
      }




    }
  },

validateEmail: function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

map: function(){
    window.map = L.map('map').setView([20, 0], 2);
    // const marker = L.marker([0, 0]).addTo(window.map);
    const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);

},

activeFire: function(){
  // var latlng = L.latLng(0, 0);
  // var layerGroup = L.layerGroup().addTo(map);
  // debugger;
  let nasaReqURL = 'https://eonet.gsfc.nasa.gov/api/v2.1/categories/8';
  fetch(nasaReqURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let arrayLength = data.events.length;
      app.fireNumber(arrayLength);
      console.log(arrayLength);
      for (var i = 0; i < arrayLength; i++) {
      // console.log(myStringArray[i]);
      // //Do something
      let fireLat = data.events[i].geometries[0].coordinates[1];
      let fireLon = data.events[i].geometries[0].coordinates[0];
      console.log (fireLat, fireLon);
      const fireIcon = L.icon({
          iconUrl: 'images/fire_icon.png',
          iconSize: [15, 23.625],
          iconAnchor: [7.5, 11.8125],
          // popupAnchor: [-3, -76],
          // shadowUrl: 'my-icon-shadow.png',
          // shadowSize: [68, 95],
          // shadowAnchor: [22, 94]
      });
      let marker = new L.marker([fireLat, fireLon], {icon: fireIcon}).addTo(window.map);
      // .bindPopup(locations[i][0])
      // marker.addTo(map);
      // var latlng = L.latLng(fireLat, fireLon);
      // marker = L.marker([fireLat,fireLon]).addTo(layerGroup);
    };})
      // .addTo(map);
      // let fireLat = data.events[0].geometries[0].coordinates[];
      // let fireLon = data.events[0].geometries[0].coordinates[];
      // console.log (content, color, city, country);
      // debugger;
      // app.displayResult(content, color, city, country)

     .catch(error => console.log(error))


},

fireNumber: function(arrayLength){
  let numberofFire = arrayLength;
  $("#bottom").html(`<p>${numberofFire}</p>`);
},

// addMarker: function(fireLat, fireLon){
//   let lat = fireLat;
//   let lon = fireLon;
//   let marker = L.marker([`${lat}, ${lon}`]).addTo(map);
//   marker.setLatLng(`${lat}, ${lon}`);
// },
 // marker.setLatLng([latitude, longitude]);

// function validateEmail(email) {
//   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(email);
// },
// addTo: function (map) {
//   map.addLayer(map);
//   // return this;
//   return t.addLayer(map),map;
// },

};





// let black;
// document.getElementById('solution_button').addEventListener("click", openPopup);
//
// function openPopup(){
//   document.getElementById('popup').style.display = "block";
//   console.log("success")
// }
//
// document.getElementById('close_button').addEventListener("click", closePopup);
//
// function closePopup(){
//   document.getElementById('popup').style.display = "none";
//   console.log("close")
// }
