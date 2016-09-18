package main

import (
    "encoding/json"
    "net/http"
)

func TestHandler(w http.ResponseWriter, r *http.Request) {
  res := map[string]interface{}{
    "error": false,
    "text": "this is a test",
  }

  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)

  if err := json.NewEncoder(w).Encode(res); err != nil {
    panic(err);
  }
}

