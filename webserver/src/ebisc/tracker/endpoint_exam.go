package main

import (
  "github.com/istreeter/gotools/jsonhttp"
  "github.com/istreeter/gotools/optshttp"
  "gopkg.in/mgo.v2/bson"
  "gopkg.in/mgo.v2"
  "net/http"
  "time"
  "fmt"
)

var endpointExam = "/exams/{date}"
var endpointExamLatest = "/exams/latest"

type examForm struct {
  Date time.Time  `path:"date" bson:"date,omitempty"`
}

func handleExam (s *mgo.Session) http.Handler {
  return &examHandler{session: s}
}

func handleExamLatest (s *mgo.Session) http.Handler {
  return &examHandler{session: s}
}

type examHandler struct {
  session *mgo.Session
}

func (e *examHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  opts := &examForm{}
  if err := optshttp.UnmarshalPath(req, opts); err != nil {
    jsonhttp.Error(w, err.Error(), http.StatusBadRequest)
  }

  session := e.session.Copy()
  defer session.Close()
  db := session.DB("ebisc")
  c := db.C("exam")

  questions := []bson.M{}
  exam := bson.M{"questions": questions}
  if err := c.Find(opts).Sort("-date").One(&exam); err != nil {
    if (err == mgo.ErrNotFound) {
      jsonhttp.Error(w, fmt.Sprintf("Exam with date %v not found", opts.Date), http.StatusNotFound)
      return
    }
    jsonhttp.Error(w, "Server database error", http.StatusInternalServerError)
    return
  }

  c = db.C("question_module")
  for _, q := range questions {
    if (q["module"] == nil) {
      continue
    }
    err := c.Find(
        bson.M{"module": q["module"]},
      ).Select(
        bson.M{"title": 1, "description": 1, "_id": 0},
      ).One(&q)

    if err != nil && err != mgo.ErrNotFound {
      jsonhttp.Error(w, "Server database error", http.StatusInternalServerError)
      return
    }
  }
  delete(exam, "_id")
  exam["error"] = false
  jsonhttp.OK(w, exam)
}
