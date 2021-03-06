package main

import (
  "github.com/istreeter/gotools/jsonhttp"
  "github.com/istreeter/gotools/optshttp"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
  "net/http"
  "time"
)


var endpointLineFails = "/exams/{date}/line_fails"

type lineFailsForm struct {
  Limit uint        `form:"limit" bson:"-"`
  Offset uint       `form:"offset" bson:"-"`
  Date *time.Time   `path:"date"      bson:"date,omitempty"`
  Module *string    `form:"module"    bson:"module,omitempty"`
}

func handleLineFails (s *mgo.Session) http.Handler {
  return &lineFailsHandler{ session: s }
}

type lineFailsHandler struct {
  session *mgo.Session
}

func (h *lineFailsHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  opts := &lineFailsForm{ Limit: 100 }
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
  c := session.DB("ebisc").C("question_fail")

  qFails := listResponse{
    Offset: opts.Offset,
    Limit: opts.Limit,
  }

  o1 := bson.M{"$match": opts}
  oDistinct2 := bson.M{"$group": bson.M{"_id": "$cellLine"}}
  oDistinct3 := bson.M{"$group": bson.M{"_id": nil, "count": bson.M{"$sum": 1}}}
  operationsDistinct := []bson.M{o1,oDistinct2, oDistinct3}
  pipeDistinct := c.Pipe(operationsDistinct)
  countResults := struct{Count uint}{}
  if err := pipeDistinct.One(&countResults); err != nil && err != mgo.ErrNotFound {
      jsonhttp.Error(w, err.Error(), http.StatusInternalServerError)
  }
  qFails.Total = countResults.Count

  if (qFails.Total > qFails.Offset) {

    o2 := bson.M{
      "$group": bson.M{"_id": "$cellLine",  "modules": bson.M{"$addToSet": "$module"}},
    }
    o3 := bson.M{
      "$project": bson.M{"cellLine": "$_id", "modules": 1, "count": bson.M{"$size": "$modules"}},
    }
    o4 := bson.M{
      "$sort": bson.D{{"count", -1}, {"cellLine", 1}},
    }
    o5 := bson.M{"$skip": opts.Offset}
    o6 := bson.M{"$limit": opts.Limit}

    o7 := bson.M{
      "$project": bson.M{"cellLine": 1, "modules": 1, "_id": 0},
    }

    operations := []bson.M{o1,o2,o3,o4,o5,o6,o7}
    pipe := c.Pipe(operations)

    if err := pipe.All(&qFails.Items); err != nil {
      jsonhttp.Error(w, "Database pipe error", http.StatusInternalServerError)
      return
    }
  }

  jsonhttp.OK(w, qFails)

}
