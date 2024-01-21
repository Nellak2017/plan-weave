let hoursToSeconds = (hours: float) => hours *. 60.0 *. 60.0

let hoursToMillis = (hours: float) => hours *. 60000.0 *. 60.0

let millisToHours = (milliseconds: float) => milliseconds /. 60000.0 /. 60.0

let add = (start: Js.Date.t, hours: float) =>
  Js.Date.fromFloat(Js.Date.getTime(start) +. hoursToMillis(hours))

let subtract = (time: Js.Date.t, eta: Js.Date.t) =>
  millisToHours(Js.Date.getTime(time) -. Js.Date.getTime(eta))

let dateToToday = (start: Js.Date.t): result<Js.Date.t, string> => {
  open Js.Date
  let now = fromFloat(now()) // Date of now

  if fromFloat(0.0) <= start && Js.Float.isFinite(valueOf(start)) {
    let initOfToday = valueOf(
      makeWithYMD(~year=getFullYear(now), ~month=getMonth(now), ~date=getDate(now), ()),
    )
    let initOfStart = valueOf(
      makeWithYMD(~year=getFullYear(start), ~month=getMonth(start), ~date=getDate(start), ()),
    )
    Ok(fromFloat(initOfToday +. (valueOf(start) -. initOfStart))) // start of today + millis elapsed in start's day
  } else {
    Error("Invalid input. Expected a Date for dateToToday function.")
  }
}

let calculateEfficiency = (startTime: float, endTime: float, ttcHours: float): Result.t<
  float,
  string,
> => {
  let normalFormula = hoursToSeconds(ttcHours) /. (endTime -. startTime)

  // Conditional Check booleans
  let normalFormulaCondition: bool =
    startTime < endTime &&
    startTime >= 0.0 &&
    endTime > 0.0 &&
    ttcHours > 0.0 &&
    ttcHours < 86400.0 &&
    endTime -. startTime <= 86400.0
  let inverseNormalFormulaCondition: bool =
    startTime > endTime && startTime >= 0.0 && endTime > 0.0 && ttcHours > 0.0
  let invalidInputTypeCondition: bool =
    !Js.Float.isFinite(startTime) || !Js.Float.isFinite(endTime) || !Js.Float.isFinite(ttcHours)
  let invalidInputRangeCondition: bool =
    startTime < 0.0 ||
    endTime -. startTime > 86400.0 ||
    endTime < 0.0 ||
    ttcHours <= 0.0 ||
    ttcHours > 86400.0

  // Calculate Efficiency Cases
  switch true {
  | _ if normalFormulaCondition => Ok(normalFormula)
  | _ if inverseNormalFormulaCondition => Ok(-1.0 /. normalFormula)
  | _ if invalidInputTypeCondition => Error("Invalid input parameter types")
  | _ if invalidInputRangeCondition => Error("Invalid input parameter range")
  | _ => Error("Unknown Error has occurred in calculateEfficiency formula, check input parameters")
  }
}
