package main

import (
    "net/http"
)

type angularDir struct {
  dir string
}

func (dir angularDir) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  http.ServeFile(w, r, fmt.Sprintf("%s/index.html", dir.dir))
}
