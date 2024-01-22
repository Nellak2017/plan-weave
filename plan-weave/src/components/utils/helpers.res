let isNullOrUndefined = (val): bool => {
  switch Nullable.toOption(val->Nullable.make) {
  | Some(value) => value != val
  | _ => true
  }
}
let floatToStringNullable = (num: float, ~fallback="undefined or null"): string => {
  open Js.Float
  isNullOrUndefined(num) ? fallback : toString(num)
}

// migrated functions

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
  open Js.Float
  let normalFormula = hoursToSeconds(ttcHours) /. (endTime -. startTime)

  // Helper Strings
  let parametersString = `\nstartTime = ${floatToStringNullable(
      startTime,
    )}}\nendTime = ${floatToStringNullable(endTime)}}\nttcHours = ${floatToStringNullable(
      ttcHours,
    )}}`
  let undefinedString = `Type Error. Expected (startTime, endTime, ttcHours := Not undefined).${parametersString}`
  let invalidTypeString = `Type Error. Expected (startTime, endTime, ttcHours := Float).${parametersString}`
  let parameterRangeString = `Invalid input parameter Range.`
  let beyondMaxDateString = `${parameterRangeString} Expected (startTime, endTime := [0,max safe date (8.64e15))).${parametersString}`
  let belowZeroErrorString = `${parameterRangeString} Expected (startTime, endTime := [0,max safe date (8.64e15)]), (ttcHours := (0,24]).${parametersString}`
  let moreThanDayString = `${parameterRangeString} Expected (endTime - startTime <= 86400), (ttcHours <= 24).${parametersString}`
  let startEqualsEndString = `${parameterRangeString} Expected (startTime === endTime).${parametersString}`
  let unknownErrorString = `Unknown Error has occurred in calculateEfficiency function.${parametersString}`

  // Conditional Check booleans
  let undefinedError =
    Nullable.make(startTime) === Nullable.undefined ||
    Nullable.make(endTime) === Nullable.undefined ||
    Nullable.make(ttcHours) === Nullable.undefined
  let invalidInputTypeError = !isFinite(startTime) || !isFinite(endTime) || !isFinite(ttcHours)

  // Calculate Efficiency Cases
  switch true {
  | _ if undefinedError => Error(undefinedString)
  | _ if invalidInputTypeError => Error(invalidTypeString)
  | _ if startTime < 0.0 || endTime < 0.0 || ttcHours <= 0.0 => Error(belowZeroErrorString)
  | _ if startTime > 8.64e15 || endTime > 8.64e15 => Error(beyondMaxDateString)
  | _ if endTime -. startTime > 86400.0 || ttcHours > 24.0 => Error(moreThanDayString)
  | _ if startTime === endTime => Error(startEqualsEndString)
  | _ if startTime < endTime => Ok(normalFormula)
  | _ if startTime > endTime => Ok(-1.0 /. normalFormula)
  | _ => Error(unknownErrorString)
  }
}

type schemaType<'a, 'b> = {isValidSync: ('a, 'b) => bool}
type schemaOptions = {strict: bool}
let validateTransformation = (
  task,
  schema: schemaType<'a, schemaOptions>,
  customErrorMessage,
): result<unit, string> => {
  let customErrorProcessed = switch customErrorMessage {
  | Some(customErrorMessage) => customErrorMessage
  | None => ""
  }
  let errorMessage = switch Js.Json.stringifyAny(task) {
  | Some(str) => customErrorProcessed ++ " task : " ++ str
  | None => "Failed to stringify task for error message"
  }
  switch schema.isValidSync(task, {strict: true}) {
  | true => Ok()
  | false => Error(errorMessage)
  }
}

let isTimestampFromToday = (
  today: Js.Date.t, 
  timestamp: float,
  ~secondsFromStart=86400.0,
): bool => {
  open Js.Date
  // today can be undefined / null in regular JS land
  let todayDate = fromFloat(valueOf(today))
  let initOfToday = makeWithYMDHMS(
    ~year=getFullYear(todayDate),
    ~month=getMonth(todayDate),
    ~date=getDate(todayDate),
    ~hours=0.,
    ~minutes=0.,
    ~seconds=0.,
    (),
  )
  let startOfTodaySeconds = valueOf(initOfToday) /. 1000.
  (startOfTodaySeconds <= timestamp) && (timestamp <= (startOfTodaySeconds +. secondsFromStart))
}
