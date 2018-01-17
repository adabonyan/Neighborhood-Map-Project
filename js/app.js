/* 
Thanks to Andrew Roy Chen of Udacity for re-directing me to Foursquare,  stackoverflow for helping with knockout js and https://opensoul.org/2011/06/23/live-search-with-knockoutjs/ for helping out with search
*/

/*CONSOLE ERROR EVENTS LISTENER 
https://www.linkedin.com/pulse/how-catch-api-key-google-maps-missing-invalid-sergey-fisun
*/
(function () {
  var _error = console.error;
  console.error = function (message) {
    for (var i = 0; i < _errorListeners.length; i++)
    {
      var listener = _errorListeners[i];
      listener.call(this, message);
    }
    return _error.apply(this, arguments);
  };
  var _errorListeners = [];
  console.errorListeners = {
    add: function (listener) {
        if (_errorListeners.indexOf(listener) == -1)
            _errorListeners.push(listener);
    },
    remove: function (listener) {
        _errorListeners.remove(listener);
    }
  };
})();

// SUBSCRIBE TO ALL CONSOLE ERROR MESSAGES --
console.errorListeners.add(onConsoleError);
// FIND OUT WHETHER THE ERROR IS GOOGLE MAP API KEY ERROR --
function onConsoleError(errorMessage) {
  var keyWords = ["API", "key", "Google", "Maps", "Uncaught", "TypeError", "initMap", "VM", "marker", "infowindow", "Object"];
  var isGoogleMapsApiKeyError = false;

  for (var i = 0; i < keyWords.length; i++) {
    if (!errorMessage.contains(keyWords[i], true)) {
      return;
    }
  }
  //google map api error handler  
  alert("Google Maps custom error triggered" + errorMessage);
}

// -- A COUPLE OF EXTENTION HELPERS 
Array.prototype.remove = function (item, comparer) {
  if (this.indexOf(item) != -1) {
    this.splice(startIndex, 1);
  }
};

String.prototype.contains = function (str, ignoreCase) {
  if (ignoreCase) {
    return String.prototype.indexOf.call(this.toLowerCase(), str.toLowerCase()) !== -1;
  } else {
    return String.prototype.indexOf.call(this, str) !== -1;
  }
};

function cb() {
  alert("Google maps API has failed. Please try again");
}

var myPlaces = [
  {
    "name": "Chick-fil-A",
    "address": "2201 Savoy Dr Atlanta GA 30341 USA",
    "latitude": 33.7634237,
    "longitude": -84.37235850000002,
    "icon": "ffff00"
  },

  {
    "name": "Starbucks Coffee",
    "address": "867 Peachtree St NE Atlanta GA 30308",
    "latitude": 33.7783741,
    "longitude": -84.38432069999999,
    "icon": "33cccc"
  },

  {
    "name": "Centennial Olympic Park",
    "address": " 265 Park Ave W NW, Atlanta GA 30313 GA 30009 USA",
    "latitude": 33.7618379,
    "longitude": -84.39451450000001,
    "icon": "990000"
  },

  {
    "name": "World of Coca-Cola",
    "address": "121 Baker Street NW Atlanta GA 30313 USA",
    "latitude": 33.7627423,
    "longitude": -84.39266379999998,
    "icon": "999966"
  },

  {
    "name": "CNN studio",
    "address": "190 Marietta St NW Atlanta GA 30303 USA",
    "latitude": 33.7577156,
    "longitude": -84.39442919999999,
    "icon": "cc9900"
  },

  {
    "name": "Georgia Aquarium",
    "address": "225 Baker Street NW Atlanta GA 3031 USA",
    "latitude": 33.7634237,
    "longitude": -84.39489100000003,
    "icon": "0066ff"
  },
  
  {
    "name": "Martin Luther King Jr National Historic Site",
    "address": "450 Auburn Ave NE Atlanta GA 30312 USA",
    "latitude": 33.7563407,
    "longitude": -84.37350830000003,
    "icon": "66ff33"
  },

  {
    "name": "Atlanta History Center",
    "address": "130 West Paces Ferry Road NW Atlanta GA 30305 USA",
    "latitude": 33.84182360000001,
    "longitude": -84.38627109999999,
    "icon": "df80ff"
  },

  {
    "name": "Fox Theatre",
    "address": "660 Peachtree Street NE  Atlanta Georgia 30308 USA",
    "latitude": 33.772635,
    "longitude": -84.3848734,
    "icon": "660066"
  },  
  
  {
    "name": "Atlanta Botanical Garden",
    "address": "1345 Piedmont Avenue Atlanta GA 30309 USA",
    "latitude": 33.7905858,
    "longitude": -84.37394970000003,
    "icon": "000000"
  }
];

var map;
var marker;
var main = document.getElementById('main');
var myMap = document.getElementById('map');
var goBackBtn = document.getElementById('goBackBtn');

function initMap() {
  map = new google.maps.Map(myMap, {
    zoom: 13,
    center: {lat: 33.764825, lng: -84.3867262}
  });

  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: {lat: 33.764825, lng: -84.3867262},
    title: "Cooling my head here"
  });

  infowindow = new google.maps.InfoWindow();  
  // Click on point on the map to close infowindow
  map.addListener('click', function() {
    infowindow.close(map, marker);
    map.setCenter(marker.getPosition());
  });

  marker.addListener('click', function() {
    populateInfoWindow(this, infowindow);
    map.setCenter(marker.getPosition());
  });

  bounds = new google.maps.LatLngBounds();
  // Extend boundaries of map for each marker and display marker    
  marker.setMap(map);
  bounds.extend(marker.position);

  var fsq_api_err = false;

  myPlaces.forEach(function(obj) {
    callFourSquare(obj);
    //console.log(fsq_api_err);
    if (fsq_api_err) {
      alert("There was error calling Foursquare API");
      return;
    }
    obj.marker = createMarker(obj);
    var marker = obj.marker;
    google.maps.event.addListener(marker, 'click', function() {
      var contentString = "<div class='infoWindow'><h2>" + obj.returnName + "</h2><p><b>Address : </b>" + obj.returnAddress + "</p><p><b>id: </b>" + obj.id + "</p><p><b>Phone: </b>" + obj.phone + "</p><p><b>Check-ins-Count: </b>" + obj.checkinsCount + "</p><p><b>Users Count: </b>" + obj.usersCount + "</p><p><b>Tip Count : </b>" + obj.tipCount + "</p><p><b>website: </b><a href='" + obj.url + "' target='_blank'>Visit website</a></p></div>";
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        marker.setAnimation(null);
      }, 2000);      
    });

    google.maps.event.addListener(infowindow, 'closeclick', function () {
      map.setCenter({lat: 33.764825, lng: -84.3867262}); 
    });
       
    openInfowindow = function(obj) {
      google.maps.event.trigger(obj.marker, 'click');
    };

    obj.marker.setMap(map);
    bounds.extend(obj.marker.position);  
  });
  map.setCenter({lat: 33.764825, lng: -84.3867262});
  map.fitBounds(bounds);
  viewMap();

  var VM = function() {
    self = this;
    self.placesOfInterest = ko.observableArray(myPlaces);
    self.query = ko.observable('');

    self.display = function(place) {
      viewMap();
      google.maps.event.trigger(place.marker, 'click');
    };

    self.search = ko.computed(function() {
      return ko.utils.arrayFilter(self.placesOfInterest(), function(place) {
        var match = place.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        place.marker.setVisible(match);
        return match;
      });
    });
    
    self.goBack = function() {
      self.placesOfInterest().forEach(function(obj) {
        obj.marker.setVisible(true);
      });
      self.query('');
      infowindow.close(map, marker);
      map.setCenter({lat: 33.764825, lng: -84.3867262});
      main.setAttribute("class", "main");
      myMap.style.zIndex = "-1";
      goBackBtn.style.zIndex = "-1";
    };    
  };
  ko.applyBindings(new VM());
}
//FourSqure does not release place photo, panorama
function callFourSquare(obj) {
  var constant = 'https://api.foursquare.com/v2/venues/search?client_id=RATCVBUAFGTEBRLM1BZUIHWMGR42CVTXY5LMFIXJ2TBBZRWF&client_secret=Z1MF1BSANQW0JXHKZN1U5ZYYEMJR2PFCACTOE25COGF2HO05&v=20180105';
  var url = constant + '&ll=' + obj.latitude + ',' + obj.longitude + '&radius=100&query=' + obj.name + '&limit=1';  

  $(function() {
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(data) {
        var returnName = data.response.venues[0].name;
        var id = data.response.venues[0].id;  //Keep for future photo api
        var formattedAddress = data.response.venues[0].location.formattedAddress;
        var returnAddress = formattedAddress[0] + ' ' + formattedAddress[1] + ' ' + formattedAddress[2];        
        var phone = data.response.venues[0].contact.phone;
        var url = data.response.venues[0].url;
        var checkinsCount = data.response.venues[0].stats.checkinsCount;
        var tipCount = data.response.venues[0].stats.tipCount;
        var usersCount = data.response.venues[0].stats.usersCount;
        obj.returnName = returnName;
        obj.returnAddress = returnAddress;
        obj.id = id;
        obj.phone = phone;
        obj.url = url;
        obj.checkinsCount = checkinsCount;
        obj.tipCount = tipCount;
        obj.usersCount = usersCount;
      },
      error: function(err) {
        fsq_api_err = true;
        return;
      }
    });
  });
}

function createMarker(obj) {
  defaultIcon = makeMarkerIcon(obj.icon);
  var name = obj.name;
  var position = {"lat": obj.latitude, "lng": obj.longitude};
  marker = new google.maps.Marker({
    title: name,
    position: position,
    map: map,
    icon: defaultIcon,
    animation: google.maps.Animation.DROP  //null
  });
  return marker;
}

function makeMarkerIcon(markerColor){
  // Create a new marker icon of a given color.
  markerImage = new google.maps.MarkerImage(
    'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

function populateInfoWindow(marker, infowindow) {
  infowindow.marker = marker;
  infowindow.addListener('closeclick', function() {
    infowindow.marker = null;
  });
  var contentString = "<h4>My location</h4><p>Cooling my head here</p>";
  infowindow.setContent(contentString);   
  infowindow.open(map, marker); 
}

function viewMap() {
  main.setAttribute("class", "hide");
  myMap.style.zIndex = "1";
  goBackBtn.style.zIndex = "1";
}

function goBack() {
  main.setAttribute("class", "main");
  myMap.style.zIndex = "-1";
  goBackBtn.style.zIndex = "-1";
}
