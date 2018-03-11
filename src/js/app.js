//list array of places
var hotelsList = ko.observableArray([]);
var markersPosition = ko.observableArray([]);


// to ensure Context
var _this = this;
//fill List Array with data from locations json file
var placesJson = $.getJSON("js/locations.json", function (data) {
    ko.utils.arrayForEach(data, function (item) {
        _this.hotelsList.push(item);
    });
    })
    .fail(function (error) {
        toastr.error("Data wasn't loaded, Please try again later");
    });

/* Map Data and foursquare API  Constructor
 Specific for each hotel in Alexandria
 */
var configureMapData = function (hotelItem, map) {
    var self = this;
    //Declare Dynamic Data [title, lat,long, iconColor, venueID]
    this.title = ko.observable(hotelItem.title);
    this.lat = ko.observable(hotelItem.lat);
    this.long = ko.observable(hotelItem.long);
    this.iconColor = ko.observable(hotelItem.iconColor);
    this.venueID = ko.observable(hotelItem.venueID);

    //Declare Static Variables 
    // Foursquare userless Auth. 
    var clientID = "YRKUJJEYS3FLUNCJA3LAKGEHVSEYUI1TLY0UIVGNRSKK0QHB";
    var clientSecret = "NHGCATZKA01MOF4CVNHIHOOGG4R0MNUDSOG4SFS4B4RYC3U0";
    var foursquareURL = "https://api.foursquare.com/v2/venues/" + this.venueID() +
        '?client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180311';

        $.ajax({
        url: foursquareURL,
        dataType: 'jsonp',
        success: function (data) {
            // Make results easier to handle
            var result = data.response.venue;
            self.infoWindow = new google.maps.InfoWindow({
                content: '<div class="info-window"><h3>' +
                    result.name +
                    '</h3><p>' + 'Foursquare Page' + '</p><a href="' +
                    result.canonicalUrl +
                    '" target="new">Let\'s go...</a></div>'
            });
            self.infoWindow.addListener('closeclick', function () {
                self.getClickedLocation();

            });

        },
        error: function () {
            toastr.error("Data didn't load correctly, please try again in a while");
        }
    });

    var pinIcon = {
        path: 'M322.621,42.825C294.073,14.272,259.619,0,219.268,0c-40.353,0-74.803,14.275-103.353,42.825   c-28.549,28.549-42.825,63-42.825,103.353c0,20.749,3.14,37.782,9.419,51.106l104.21,220.986   c2.856,6.276,7.283,11.225,13.278,14.838c5.996,3.617,12.419,5.428,19.273,5.428c6.852,0,13.278-1.811,19.273-5.428   c5.996-3.613,10.513-8.562,13.559-14.838l103.918-220.986c6.282-13.324,9.424-30.358,9.424-51.106   C365.449,105.825,351.176,71.378,322.621,42.825z M270.942,197.855c-14.273,14.272-31.497,21.411-51.674,21.411   s-37.401-7.139-51.678-21.411c-14.275-14.277-21.414-31.501-21.414-51.678c0-20.175,7.139-37.402,21.414-51.675   c14.277-14.275,31.504-21.414,51.678-21.414c20.177,0,37.401,7.139,51.674,21.414c14.274,14.272,21.413,31.5,21.413,51.675   C292.355,166.352,285.217,183.575,270.942,197.855z',
        fillColor: this.iconColor(),
        fillOpacity: 0.8,
        scale: 0.06
    };

    // Set up the location's marker using the data from the hotelsList
    // object
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat(), this.long()),
        icon: pinIcon,
        animation: google.maps.Animation.DROP,
        title: this.title()
    });
    markersPosition.push(marker.position);
    // Keeps track of whether or not this configureMapData's Info Window is open
    this.infoWindowOpen = false;

    marker.addListener('click', function () {
        self.getClickedLocation();
    });

    // Function that processes clicking on the marker or the location
    // in the list view, check if info window is lready opened or not
    this.getClickedLocation = function () {
        if (!self.infoWindowOpen) {
            map.setZoom(16);
            self.infoWindow.open(map, marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            map.panTo(marker.position);
            self.infoWindowOpen = true;

        } else {
            self.infoWindow.close();
            map.setZoom(12);
            marker.setAnimation(null);
            map.fitBounds(new google.maps.LatLngBounds(
                new google.maps.LatLng(31.22704, 29.94624),
                new google.maps.LatLng(31.28893, 30.025023)));
            self.infoWindowOpen = false;


        }
    };

    // Controls the visibility of the marker based on the search filter
    self.isVisible = ko.observable(false);

    self.isVisible.subscribe(function (currentState) {
        if (currentState) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
    });

    // Default is that the marker is visible
    self.isVisible(true);


};

var ViewModel = function () {
    var self = this;

    // Google Map Marker needed Properties

    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 12,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(31.265608, 30.00393), // Alexandria Egypt

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#626092"
                    }
                ]
            }
        ]

    };
    var googleMap = new google.maps.Map(document.querySelector('#map'),
        mapOptions);


    // Create an array of the locations
    self.locationList = ko.observableArray([]);

    hotelsList().forEach(function (locationItem) {
        self.locationList().push(new configureMapData(locationItem, googleMap));
    });

    // Stores the value of the search box
    self.searchTxt = ko.observable('');

    // filteredItems contains the locations that meet the search criteria
    self.filteredItems = ko.computed(function () {
        var filter = self.searchTxt().toLowerCase();
        return ko.utils.arrayFilter(self.locationList(), function (item) {
            var match = item.title().toLowerCase().indexOf(filter.toLowerCase()) >= 0;
            item.isVisible(match);
            return match;
        });
    });

};

var initMap = function () {
    if (typeof google === 'undefined') {
        toastr.error("Map not loaded, Please check your internet connection and refresh the page");
    } else {
        ko.applyBindings(new ViewModel());
    }
};