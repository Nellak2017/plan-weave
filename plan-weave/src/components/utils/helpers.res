@module("./constants.js") external millisecondsPerHour: float = "MILLISECONDS_PER_HOUR"
@module("./constants.js") external millisecondsPerDay: float = "MILLISECONDS_PER_DAY"
@module("./constants.js") external taskStatuses: Js.t<{..}> = "TASK_STATUSES"

// private ReScript specific helpers or constants
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
let step = (x: float, ~threshold=0.) => x > threshold ? 1. : 0.

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
  let timeDiff = endTime -. startTime
  let efficiencyFormula = hoursToSeconds(ttcHours) /. (timeDiff *. step(timeDiff))

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
  let startGreaterEndString = `${parameterRangeString} Expected (startTime < endTime).No longer supporting domain extension.${parametersString}`
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
  | _ if startTime > endTime || !isFinite(efficiencyFormula) => Error(startGreaterEndString)
  | _ if startTime < endTime => Ok(efficiencyFormula)
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
  startOfTodaySeconds <= timestamp && timestamp <= startOfTodaySeconds +. secondsFromStart
}

// TODO: Convert this to default record with types
let formatTimeLeft = (
  ~currentTime=Js.Date.make(),
  ~endTime=Js.Date.make(),
  ~timeDifference=0.0,
  ~minuteText="minutes left",
  ~hourText="hour",
  ~hourText2="hours left",
  ~overNightMode=false,
): string => {
  open Js.Date

  let calculateTimeDifference = (
    ~endTime: Js.Date.t,
    ~currentTime=make(),
    ~timeDifference=0.,
    ~overNightMode=false,
  ) => {
    let adjustedEndTimeValue = switch overNightMode {
    | true => valueOf(add(endTime, 24.))
    | false => valueOf(endTime)
    }

    switch true {
    | _ if !Js.Float.isFinite(timeDifference) => Error("timeDifference must be a number")
    | _ if !Js.Types.test(overNightMode, Boolean) => Error("overNightMode must be a boolean")
    | _ if timeDifference > 0. => Ok(timeDifference *. millisecondsPerHour)
    | _ if timeDifference === 0. => Ok(Math.max(0., adjustedEndTimeValue -. valueOf(currentTime)))
    | _ => Error(`Unspecified error.\nendTime=${Belt.Float.toString(valueOf(endTime))}\ncurrentTime=${Belt.Float.toString(valueOf(currentTime))}\ntimeDifference=${Belt.Float.toString(timeDifference)}`)
    }
  }

  let formatTime = timeMillis => {
    let totalHours = timeMillis /. millisecondsPerHour
    let timeLeftInHours = Math.floor(totalHours)
    let timeLeftInMinutes = Math.floor((totalHours -. timeLeftInHours) *. 60.)

    let parsedString = if timeLeftInHours > 0. {
      let secondsText = timeLeftInHours > 1. ? "s" : ""
      timeLeftInMinutes > 0.
        ? `${Belt.Float.toString(timeLeftInHours)} ${hourText}${secondsText} ${Belt.Float.toString(
              timeLeftInMinutes,
            )} ${minuteText}`
        : `${Belt.Float.toString(timeLeftInHours)} ${hourText2}`
    } else {
      `${Belt.Float.toString(timeLeftInMinutes)} ${minuteText}`
    }

    switch Js.Types.test(parsedString, String) {
      | true => Ok(parsedString)
      | false => Error("Invalid input in format Time")
    }
  }

  let res = calculateTimeDifference(~endTime, ~currentTime, ~timeDifference, ~overNightMode)
  -> Belt.Result.flatMap(res => formatTime(res))
  
  switch res {
    | Ok(result) => result
    | Error(errorMessage) => errorMessage 
  }
}
