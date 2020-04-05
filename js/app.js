// Add the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js').then( () => {
      console.log('Service Worker Registered')
    })
  })
}

//function that gets the location and returns it
function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geo Location not supported by browser");
  }
}
//function that retrieves the position
function showPosition(position) {
  var location = {
    longitude: position.coords.longitude,
    latitude: position.coords.latitude
  }
  console.log(location)
}

//function that Submits the data
function saveAppointment() {
  var index = localStorage.getItem("currentIndex");
  index = Number(index) + 1;
  localStorage.setItem("currentIndex", index);
  console.log("New Index: " + index);

  var name = document.getElementById("nameId").value
  if (name == "") {
    alert("Error: Enter details before saving.")
  }

  var jsonObj = {
    "name": document.getElementById("nameId").value,
    "number": document.getElementById("numberId").value,
    "location": document.getElementById("locationId").value,
    "date": document.getElementById("dateId").value,
    "time": document.getElementById("timeId").value,
    "geoLocation": document.getElementById("geoLocationId").value
  };
  localStorage.setItem("row"+index, JSON.stringify(jsonObj, null, 4));
  console.log("Adding Object: " + jsonObj);
  alert("Appointment Saved Successfully!")
  resetInputs()
}

// Function to clear the previous inputs.
function resetInputs() {
  document.getElementById("nameId").value = ""
  document.getElementById("numberId").value = ""
  document.getElementById("locationId").value = ""
  document.getElementById("dateId").value = ""
  document.getElementById("timeId").value = ""
  document.getElementById("geoLocationId").value = ""
}

//function that Generates table from data
function generateAppListTable() {
  //Build an array containing Customer records.
  var appointments = new Array();
  appointments.push(["#", "Name", "Place", "Date"]);

  var numberOfRows = localStorage.getItem("currentIndex");
  for (var index = 1; index <= numberOfRows; index++) {
    var jsonString = localStorage.getItem("row"+index);
    var jsonObj = JSON.parse(jsonString)

    if (jsonObj != null) {
      var column1 = jsonObj.name + "</br>" + "Ph: " + jsonObj.number
      var geoLoc = ""
      if (jsonObj.geoLocation != null) {
        geoLoc = "GEO: " + jsonObj.geoLocation
      }
      var column2 = jsonObj.location + "</br>" + geoLoc
      var column3 = jsonObj.date + "</br>" + "At: " + jsonObj.time
      appointments.push([index, column1, column2, column3]);
    }
  }

  //Create a HTML Table element.
  var table = document.createElement("TABLE");
  table.border = "1";

  //Get the count of columns.
  var columnCount = appointments[0].length;

  //Add the header row.
  var row = table.insertRow(-1);
  for (var i = 0; i < columnCount; i++) {
      var headerCell = document.createElement("TH");
      headerCell.innerHTML = appointments[0][i];
      row.appendChild(headerCell);
  }

  //Add the data rows.
  for (var i = 1; i < appointments.length; i++) {
      row = table.insertRow(-1);
      for (var j = 0; j < columnCount; j++) {
          var cell = row.insertCell(-1);
          cell.innerHTML = appointments[i][j];
      }
  }

  var dvTable = document.getElementById("apptTable");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);
}