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
  api.Handle("/code_run", &apiHandler{codeRunListHandlerFn, session});
  api.Handle("/code_run/latest", &apiHandler{codeRunHandlerFn, session});
  api.Handle("/code_run/{date}", &apiHandler{codeRunHandlerFn, session});
  api.Handle("/fails/module/{module}", &apiHandler{moduleHandlerFn, session});
  api.PathPrefix("/").Handler(&apiHandler{notFoundHandlerFn, session});
}
