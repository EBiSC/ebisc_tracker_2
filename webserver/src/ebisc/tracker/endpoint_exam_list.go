package main

import (
  "github.com/istreeter/gotools/jsonhttp"
  "github.com/istreeter/gotools/optshttp"
  "gopkg.in/mgo.v2/bson"
  "gopkg.in/mgo.v2"
  "net/http"
  "time"
)


var endpointExamList = "/exams"

type examListForm struct {
  Date *time.Time `form:"date"`
}

func handleExamList (s *mgo.Session) http.Handler {
  return &examListHandler{ session: s }
}

type examListHandler struct {
  session *mgo.Session
}

func (e *examListHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  opts := &examListForm{}
  if err := optshttp.UnmarshalForm(req, opts); err != nil {
    jsonhttp.Error(w, err.Error(), http.StatusBadRequest)
  }
  session := e.session.Copy()
  defer session.Close()
  c:= session.DB("ebisc").C("exam")

  query := bson.M{}
  if opts.Date != nil {
    query["date"] = bson.M{"$lt": opts.Date}
  }

  var items []interface{}
  if err := c.Find(query).Sort("-date").Limit(10).Select(bson.M{"date": 1, "_id": 0}).All(&items); err != nil {
    jsonhttp.Error(w, "Server database error", http.StatusInternalServerError)
    return
  }
  m := bson.M{"items": items, "error": false}
  jsonhttp.OK(w, m)

}
