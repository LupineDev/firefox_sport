
activity = {}

activity.geoStatus = function() {
  if ("geolocation" in navigator) {
    /* geolocation is available */
    return "GPS Available";
  } else {
    /* geolocation IS NOT available */
    return"No GPS";
  }
};

activity.availableTypes = [
  "Running",
  "Walking",
  "Cycling",
  "Hiking"
]

activity.Pos = function(data) {
  this.lat = data.lat;
  this.lng = data.lng;
  this.time = data.time;
};

activity.PosList = Array;

activity.Activity = function(activityType) {
  this.startedAt = m.prop(null);
  this.activityType = m.prop(activityType);
  this.elapsedTime = m.prop(0);
  this.distance = m.prop(0);
  this.elevDistance = m.prop(0);
  this.avgPace = m.prop(0);
  this.curPace = m.prop(0);
  this.curPos = m.prop(null);
  this.lastPos = m.prop(null);
  this.posList = new activity.PosList();
  this.gpsAccuracy = m.prop(0);
  this.gpsWatcher = m.prop(null);

  this.startTracking = function() {
    this.startedAt((new Date()).getTime());
    this.lastPos(new activity.Pos(
      {lat: 'start', lng: 'start', time: (new Date()).getTime()}
    ));
    this.gpsWatcher(navigator.geolocation.watchPosition(
      this.watchLocation,
      this.gpsError,
      {enableHighAccurace: true, maximumAge: 0}
    ));
  }

  this.watchLocation = function(location) {
    this.curPos(new activity.Pos({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      time: location.coords.timestamp
    }))
    this.gpsAccuracy(location.coords.accuracy);
  }.bind(this)

  this.stopTracking = function() {
    if (this.gpsWatcher() != null) {
      navigator.geolocation.clearWatch(this.gpsWatcher());
    }
  }

  this.gpsError = function() {
    alert("Error getting GPS location...");
  }
}

activity.controller = function() {
  this.status = m.prop("Not started");
  this.activity = m.prop(new activity.Activity(this.activityType));
  this.activityType = m.prop(activity.availableTypes[0]);

  this.start = function() {
    console.log("starting activity...");
    this.status("Started");
    this.activity().startTracking();
  }.bind(this);

  this.stop = function() {
    console.log("stopping activity...");
    this.status("Not Started");
    this.activity().stopTracking();
  }.bind(this);

  this.isStarted = function() {
    if (this.status() == "Started") {
      return true;
    } else {
      return false;
    }
  }

  this.toggleStarted = function() {
    console.log("isStarted", this.isStarted());
    console.log("status", this.status());
    if (this.isStarted() == true) {
      this.stop();
    } else {
      this.start();
    }
  }.bind(this)

  this.buttonText = function() {
    if (this.isStarted()) {
      return "Stop " + this.activityType();
    } else {
      return "Start " + this.activityType();
    }
  }

  this.buttonClass = function() {
    if (this.isStarted() == true) {
      return "danger";
    } else {
      return "recommend";
    }
  }
}

activity.view = function(ctrl) {
  return m("html", [
    m("body", [
      m("head", [
        m("link", {href: "/style/buttons.css", rel: "stylesheet", type: "text/css"}),
        m("link", {href: "/style/lists.css", rel: "stylesheet", type: "text/css"}),
        m("link", {href: "/style/headers.css", rel: "stylesheet", type: "text/css"}),
        m("link", {href: "/style/input_areas.css", rel: "stylesheet", type: "text/css"}),
      ]),
      m("section", {class: "", role: "region"}, [
        m("header", [
          m("h1", "Firefox Sport")
        ])
      ]),
      m("section", {role: "region"}, [
        m("p",[m("select",
          {onchange: m.withAttr("value", ctrl.activityType), disabled: ctrl.isStarted(), value: ctrl.activityType()},
          [
            activity.availableTypes.map(function(activityType, index) {
              return m('option', {value: activityType}, activityType);
            })
          ]
        )]),
      ]),
      m("section", {"role": "region"}, [
        m("h3", "Current Activity"),
        m("p","Elapsed Time: " + ctrl.activity().elapsedTime()),
        m("p","Distance: " + ctrl.activity().distance()),
        m("p","Average Pace: " + ctrl.activity().avgPace()),
        m("p","Current Pace: " + ctrl.activity().curPace()),
        m("p","GPS Accuracy: " + ctrl.activity().gpsAccuracy()),
      ]),
      m("section", {"role": "region"}, [
        m("button", {class: ctrl.buttonClass(), onclick: ctrl.toggleStarted}, ctrl.buttonText()),
      ]),
    ])
  ]);
};

//initialize the application
m.module(document, activity);

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  console.log('More or less ' + crd.accuracy + ' meters.');
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

navigator.geolocation.getCurrentPosition(success, error, options);
