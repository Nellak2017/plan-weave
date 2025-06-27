// the v2 schema for use after task migration from v1 -> v2
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
	Value TaskID
	Label Label
}

type Task struct {
	ID            TaskID
	UserID        string // UUID string
	Dependencies  []Dependency
	Task          string // Max 50 characters
	Selected      bool
	Ttc           Hours      // Estimated time to complete in hours
	LiveTime      Hours      // Total time worked in hours
	DueDate       ISOTime    // ISO
	Efficiency    Efficiency // Percentage. Ex: 1.0 = 100%
	ParentThread  ThreadID   // Enum: Dynamically determined
	Waste         Hours      // Time wasted
	Eta           ISOTime    // Projected completion
	Weight        Weight
	Status        TaskStatus // Enum: Statically determined
	LiveTimeStamp ISOTime    // ISO

	LastCompleteTime   ISOTime // default = today
	LastIncompleteTime ISOTime // default = today
	IsLive             bool    // default = false
}
