
// var geoStatusMsg = document.getElementById("geoStatus");

/*if ("geolocation" in navigator) {
  geoStatusMsg.innerHTML = "GPS IS AVAILABLE";
} else {
  geoStatusMsg.innerHTML = "GPS IS OFF";
} */
// geoStatusMsg.innerHTML = "poopy";
// geoStatusMsg.text = "pee";

//  trying mithril stuff
//for simplicity, we use this module to namespace the model classes

//the Todo class has two properties

todo = {};
todo.Todo = function(data) {
  this.description = m.prop(data.description);
  this.done = m.prop(false);
};

//the TodoList class is a list of Todo's
todo.TodoList = Array;

//the controller uses three model-level entities, of which one is a custom defined class:
//`Todo` is the central class in this application
//`list` is merely a generic array, with standard array methods
//`description` is a temporary storage box that holds a string
//
//the `add` method simply adds a new todo to the list
todo.controller = function() {
  this.list = new todo.TodoList();
  this.description = m.prop("");

  this.add = function() {
    if (this.description()) {
      this.list.push(new todo.Todo({description: this.description()}));
      this.description("");
    }
  }.bind(this);
};

//here's the view
todo.view = function(ctrl) {
  return m("html", [
    m("body", [
      m("head", [
        m("link", {href: "/style/headers.css", rel: "stylesheet", type: "text/css"}),
        m("link", {href: "/style/buttons.css", rel: "stylesheet", type: "text/css"}),
        m("link", {href: "/style/input_areas.css", rel: "stylesheet", type: "text/css"})
      ]),
      m("section", {class: "skin-organic", role: "region"}, [
        m("header", [
          m("h1", "ToDo App")
        ])
      ]),
      m("section", [
        m("input", {type: "text", onchange: m.withAttr("value", ctrl.description), value: ctrl.description()}),
        m("button", {class: "recommend", onclick: ctrl.add}, "Add"),
        m("table", [
          ctrl.list.map(function(task, index) {
            return m("tr", [
              m("td", [
                m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})
              ]),
              m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description()),
            ])
          })
        ])
      ])
    ])
  ]);
};

//initialize the application
m.module(document, todo);
