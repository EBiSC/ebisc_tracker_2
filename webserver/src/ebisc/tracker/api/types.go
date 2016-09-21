package api

import (
    "gopkg.in/mgo.v2"
    "github.com/go-errors/errors"
)

type Config mgo.DialInfo

type apiVars map[string]interface{}

type apiError struct {
  error *errors.Error
  message string
}

type apiResponse struct {
  content interface{}
  code int
}

type endpoint struct {
  route string
  fn apiHandlerFn
  opts apiOpts
}

type apiOpts map[string]int

const (
  tDATE  = 1
  tINT   = 2
  tSTR   = 3
)

type apiHandlerFn func(apiVars, *mgo.Session) *apiResponse
type apiHandler struct {
  fn apiHandlerFn
  opts apiOpts
  db *mgo.Session
}
