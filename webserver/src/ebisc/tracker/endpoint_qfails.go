package main

import (
  "github.com/istreeter/gotools/jsonhttp"
  "github.com/istreeter/gotools/optshttp"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
  "net/http"
  "time"
)


var endpointQFails = "/exams/{date}/fails"

type qFailsForm struct {
  Limit uint          `form:"limit"`
  Offset uint         `form:"offset"`
  MgoQuery struct {
    Date *time.Time   `path:"date"      bson:"date,omitempty"`
    CellLine *string  `form:"cell_line" bson:"cellLine,omitempty"`
    Batch *string     `form:"batch"     bson:"batch,omitempty"`
    Module *string    `form:"module"    bson:"module,omitempty"`
  }                   `form:",inline"   path:",inline"`
}

func handleQFails (s *mgo.Session) http.Handler {
  return &qFailsHandler{ session: s }
}

type qFailsHandler struct {
  session *mgo.Session
}

func (h *qFailsHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  opts := &qFailsForm{ Limit: 100 }
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

  query := c.Find(opts.MgoQuery);

  qFails := listResponse{
    Offset: opts.Offset,
    Limit: opts.Limit,
  }
  if n, err := query.Count(); err != nil {
    jsonhttp.Error(w, "Database error", http.StatusInternalServerError)
    return
  } else {
    qFails.Total = uint(n)
  }

  if (qFails.Total > qFails.Offset) {
    query = query.Sort("_id").
              Limit(int(opts.Limit)).
              Skip(int(opts.Offset)).
              Select(bson.M{"_id": 0})

    if err := query.All(&qFails.Items); err != nil {
      jsonhttp.Error(w, "Database find error", http.StatusInternalServerError)
      return
    }
  }

  jsonhttp.OK(w, qFails)

}
