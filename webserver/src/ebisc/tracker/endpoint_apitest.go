package main

import (
  "github.com/istreeter/gotools/jsonhttp"
  "net/http"
)

var endpointTest = "/test"

func handleTest() http.Handler {
  return &testHandler{}
}

type testHandler struct {}

func (*testHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  jsonhttp.OK(w, map[string]interface{}{"message": "this is a test", "error": false})
}
