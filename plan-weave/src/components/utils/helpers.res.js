// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Caml_obj from "rescript/lib/es6/caml_obj.js";

function hoursToSeconds(hours) {
  return hours * 60.0 * 60.0;
}

function hoursToMillis(hours) {
  return hours * 60000.0 * 60.0;
}

function millisToHours(milliseconds) {
  return milliseconds / 60000.0 / 60.0;
}

function add(start, hours) {
  return new Date(start.getTime() + hoursToMillis(hours));
}

function subtract(time, eta) {
  return millisToHours(time.getTime() - eta.getTime());
}

function dateToToday(start) {
  var now = new Date(Date.now());
  if (!(Caml_obj.lessequal(new Date(0.0), start) && Number.isFinite(start.valueOf()))) {
    return {
            TAG: "Error",
            _0: "Invalid input. Expected a Date for dateToToday function."
          };
  }
  var initOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
  var initOfStart = new Date(start.getFullYear(), start.getMonth(), start.getDate()).valueOf();
  return {
          TAG: "Ok",
          _0: new Date(initOfToday + (start.valueOf() - initOfStart))
        };
}

export {
  hoursToSeconds ,
  hoursToMillis ,
  millisToHours ,
  add ,
  subtract ,
  dateToToday ,
}
/* No side effect */