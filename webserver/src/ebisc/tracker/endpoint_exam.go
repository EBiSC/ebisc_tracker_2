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
    return
  }

  session := e.session.Copy()
  defer session.Close()
  db := session.DB("ebisc")
  c := db.C("exam")

  exam := bson.M{}
  if err := c.Find(opts).Sort("-date").One(&exam); err != nil {
    if (err == mgo.ErrNotFound) {
      jsonhttp.Error(w, fmt.Sprintf("Exam with date %v not found", opts.Date), http.StatusNotFound)
      return
    }
    jsonhttp.Error(w, "Server database error", http.StatusInternalServerError)
    return
  }

  c = db.C("question_module")
  if qSlice, ok := exam["questions"].([]interface{}); ok {
    var qMap bson.M
    for _, q := range qSlice {
      if qMap, ok = q.(bson.M); !ok {
        jsonhttp.Error(w, "Server database error", http.StatusInternalServerError)
        return
      }
      if (qMap["module"] == nil) {
        continue
      }
      expandedQ := &bson.M{}
      err := c.Find(
          bson.M{"module": qMap["module"]},
        ).Select(
          bson.M{"title": 1, "description": 1, "_id": 0},
        ).One(&expandedQ)

      if err != nil && err != mgo.ErrNotFound {
        jsonhttp.Error(w, "Server database error", http.StatusInternalServerError)
        return
      }

      for key, val := range *expandedQ {
        qMap[key] = val;
      }
    }
  }
  delete(exam, "_id")
  exam["error"] = false
  jsonhttp.OK(w, exam)
}
