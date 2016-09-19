package main

import (
    "net/http"
    "gopkg.in/mgo.v2"
    "github.com/go-errors/errors"
)

func testHandlerFn(res *apiContent, r *http.Request, db *mgo.Session) *apiError{
  *res = map[string]interface{}{
    "error": false,
    "text": "this is a test",
  }
  return nil
}

func codeRunHandlerFn(res *apiContent, r *http.Request, session *mgo.Session) *apiError{

  c := session.DB("ebisc").C("code_run")
  if err := c.Find(nil).Sort("-date").One(res); err != nil {
    return &apiError{errors.Wrap(err, 1), "Database find error", 500}
  }
  return nil
}
