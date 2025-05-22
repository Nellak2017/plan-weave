// The old v1 schema for the firebase task, will be used to migrate, remove later
package core

import "time"

// Semantic newtypes
type TaskID = int64
type Label = string
type Hours = float64
type Efficiency = float64 // 1.0 = 100%
type Weight = int32
type TaskStatus = string
type ThreadID = string

// ISO time wrapper (optional, for semantic clarity)
type ISOTime = time.Time

// Dependency structure
type Dependency struct {
	Value TaskID `json:"value"`
	Label Label  `json:"label"`
}

// FirebaseTask with semantic types
type FirebaseTask struct {
	ID                 TaskID       `json:"id"`
	Dependencies       []Dependency `json:"dependencies"`
	Task               string       `json:"task"` // Max 50 characters
	Selected           bool         `json:"selected"`
	Ttc                Hours        `json:"ttc"`                // Estimated time to complete in hours
	LiveTime           Hours        `json:"liveTime"`           // Total time worked in hours
	DueDate            ISOTime      `json:"dueDate"`            // ISO
	Efficiency         Efficiency   `json:"efficiency"`         // Percentage. Ex: 1.0 = 100%
	ParentThread       ThreadID     `json:"parentThread"`       // Enum: Dynamically determined
	CompletedTimeStamp float64      `json:"completedTimeStamp"` // ISO
	Timestamp          float64      `json:"timestamp"`          // ISO
	Waste              Hours        `json:"waste"`              // Time wasted
	Eta                ISOTime      `json:"eta"`                // Projected completion
	Weight             Weight       `json:"weight"`
	Status             TaskStatus   `json:"status"`        // Enum: Statically determined
	LiveTimeStamp      ISOTime      `json:"liveTimeStamp"` // ISO
}

type FirebaseUserCollections struct {
	Tasks map[string]FirebaseTask `json:"tasks"`
}

type FirebaseUser struct {
	ID          string                  `json:"id"`
	Username    string                  `json:"username"`
	Collections FirebaseUserCollections `json:"__collections__"` // Tasks    map[string]FirebaseTask `json:"tasks"`
}

type FirebaseData struct {
	Collections struct {
		Users map[string]FirebaseUser `json:"users"`
	} `json:"__collections__"`
}
