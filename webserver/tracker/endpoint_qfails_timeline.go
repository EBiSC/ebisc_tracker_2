package main

import (
  "github.com/istreeter/gotools/jsonhttp"
  "github.com/istreeter/gotools/optshttp"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
  "net/http"
  "time"
  "fmt"
)


var endpointQFailsTimeline = "/questions/{module}"

type qFailsTimelineForm struct {
  Limit uint         `form:"limit"`
  Date *time.Time    `form:"date"`
  Module string      `path:"module"`
}

func handleQFailsTimeline (s *mgo.Session) http.Handler {
  return &qFailsTimelineHandler{ session: s }
}

type qFailsTimelineHandler struct {
  session *mgo.Session
}

func (h *qFailsTimelineHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  opts := &qFailsTimelineForm{ Limit: 100 }
  if err := optshttp.UnmarshalForm(req, opts); err != nil {
    jsonhttp.Error(w, err.Error(), http.StatusBadRequest)
    return
  }
  if err := optshttp.UnmarshalPath(req, opts); err != nil {
    jsonhttp.Error(w, err.Error(), http.StatusBadRequest)
    return
  }
  if (opts.Limit > 100) {
    opts.Limit = 100
  }

  session := h.session.Copy()
  defer session.Close()
  c := session.DB("ebisc").C("exam")

  qFails := listResponse{
    Limit: opts.Limit,
  }

  queryParams := bson.M{"questions.module": opts.Module}
  if opts.Date != nil {queryParams["date"] = bson.M{"$lt": opts.Date}}

  if n, err := c.Find(queryParams).Count(); err != nil {
    jsonhttp.Error(w, "Database error", http.StatusInternalServerError)
    return
  } else {
    qFails.Total = uint(n)
  }

  o1 := bson.M{"$match": queryParams}

  if (qFails.Total > qFails.Offset) {

    o2 := bson.M{
      "$sort": bson.D{{"date", -1}},
    }
    o3 := bson.M{"$limit": opts.Limit}
    o4 := bson.M{ "$project": bson.M{ "question": bson.M{ "$arrayElemAt": []interface{}{bson.M { "$filter": bson.M{
      "input": "$questions",
      "as": "question",
      "cond": bson.M{"$eq": []string{"$$question.module", opts.Module}},
    }}, 0}},
      "_id": 0, "date": 1,
    }}

    o5 := bson.M{
      "$project": bson.M{"date" : 1, "numFailed": "$question.numFailed", "numTested": "$question.numTested"},
    }

    operations := []bson.M{o1,o2,o3,o4,o5}
    pipe := c.Pipe(operations)

    if err := pipe.All(&qFails.Items); err != nil {
      jsonhttp.Error(w, fmt.Sprintf("Database pipe error: %s", err.Error()), http.StatusInternalServerError)
      return
    }
  }

  jsonhttp.OK(w, qFails)

}
