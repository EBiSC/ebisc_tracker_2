package api

import (
    "github.com/gorilla/mux"
    "gopkg.in/mgo.v2"
)

func AddHandlers(r *mux.Router, dbInfo *Config) {
  session, err := mgo.DialWithInfo((*mgo.DialInfo)(dbInfo))
  if err != nil {
    panic(err)
  }
  api := r.PathPrefix("/api").Subrouter()
  api.Handle("/test", &apiHandler{testHandlerFn, session});
  api.Handle("/exams", &apiHandler{examListHandlerFn, session});
  api.Handle("/exams/latest", &apiHandler{examHandlerFn, session});
  api.Handle("/exams/{date}", &apiHandler{examHandlerFn, session});
  api.Handle("/exams/{date}/fails", &apiHandler{failHandlerFn, session});
  api.Handle("/exams/{date}/line_fails", &apiHandler{lineFailHandlerFn, session});
  api.PathPrefix("/").Handler(&apiHandler{notFoundHandlerFn, session});
}
