package angular

import (
    "net/http"
    "github.com/gorilla/mux"
    "fmt"
)

type angularDir string

func (dir *angularDir) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  http.ServeFile(w, r, fmt.Sprintf("%s/index.html", (string)(*dir)))
}

func AddHandlers(r *mux.Router, dir string) {
  r.PathPrefix("/static/").Handler(http.FileServer(http.Dir(dir)))
  r.PathPrefix("/").Handler((*angularDir)(&dir))
}
