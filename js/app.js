
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
  this.startedAt = (new Date()).getTime();
  this.activityType = m.prop(activityType);
  this.elapsedTime = m.prop(0);
  this.distance = m.prop(0);
  this.elevDistance = m.prop(0);
  this.avgPace = m.prop(0);
  this.curPace = m.prop(0);
  this.lastPos = new activity.Pos(
    {lat: 'start', lng: 'start', time: (new Date()).getTime()}
  );
  this.posList = new activity.PosList();
  this.gpsAccuracy = m.prop(0);
}

activity.controller = function() {
  this.status = m.prop("Not started");
  this.activity = m.prop(null);
  this.activityType = m.prop(activity.availableTypes[0]);

  this.start = function() {
    this.activity(new activity.Activity(this.activityType));
  }.bind(this);

  this.buttonText = function() {
    if (this.status() == "Started") {
      return "Stop " + this.activityType();
    } else {
      return "Start " + this.activityType();
    }
  }
}

activity.view = function(ctrl) {
  return m("html", [
    m("body", [
      m("head", [
        m("link", {href: "/style/headers.css", rel: "stylesheet", type: "text/css"}),
        m("link", {href: "/style/buttons.css", rel: "stylesheet", type: "text/css"}),
        m("link", {href: "/style/input_areas.css", rel: "stylesheet", type: "text/css"})
      ]),
      m("section", {class: "skin-organic", role: "region"}, [
        m("header", [
          m("h1", "Firefox Sport")
        ])
      ]),
      m("section", [
        m("select",
          {onchange: m.withAttr("value", ctrl.activityType), value: ctrl.activityType()},
          [
            activity.availableTypes.map(function(activityType, index) {
              return m('option', {value: activityType}, activityType);
            })
          ]
        ),
        m("button", {class: "recommend", onclick: ctrl.start}, ctrl.buttonText()),
      ])
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
