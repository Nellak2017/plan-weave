let hoursToSeconds = hours => float(hours) *. 60.0 *. 60.0

let hoursToMillis = hours => float(hours) *. 60000.0 *. 60.0

let millisToHours = (milliseconds: float) => milliseconds /. 60000.0 /. 60.0

let add = (start, hours) => Js.Date.fromFloat(Js.Date.getTime(start) +. hoursToMillis(hours))

let subtract = (time, eta) => millisToHours(Js.Date.getTime(time) -. Js.Date.getTime(eta))

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

let calculateEfficiency = (startTime: int, endTime: int, ttcHours: int): Result.t<float,string> => {
  let normalFormula = hoursToSeconds(ttcHours) /. float(endTime - startTime)
  switch true {
  | _ if startTime < 0 || endTime - startTime > 86400 || endTime < 0 || ttcHours <= 0 || ttcHours > 86400 => Error("Invalid input parameters")
  | _ if startTime > endTime => Ok(-1.0 /. normalFormula)
  | _ => Ok(normalFormula)
  }
}