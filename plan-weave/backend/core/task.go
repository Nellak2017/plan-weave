// the v2 schema for use after task migration from v1 -> v2
package core

type Task struct {
	id int64
	// dependencies list
	task               string
	selected           bool
	ttc                float32
	liveTime           float64
	dueDate            string // TODO: this is a iso string, I need to encode this with a type
	efficiency         float64
	parentThread       string // this is one of a few possible valid things determined at runtime, how do I encode?
	completedTimeStamp string // TODO: convert from epoch to iso. Also encode this with an iso string type
	timestamp          string // TODO: this is an iso string, do the same coversions as completedTimeStamp
	waste              float64
	eta                string // TODO: this is an iso string, do same conversion as usual
	weight             int32
	status             string // this is one of a few possible valid things determined at compile time, how do I encode?
	liveTimeStamp      string // TODO: this is an iso string, do usual conversion stuff
}
