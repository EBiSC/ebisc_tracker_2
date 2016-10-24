package main

import (
    "log"
    "net/http"
    "time"
    "flag"
    "github.com/gorilla/mux"
    "github.com/istreeter/gotools/jsonhttp"
    "gopkg.in/mgo.v2"
    "fmt"
)

func addEndpoint( api *mux.Router, path string, h http.Handler) {
  api.Handle(path, jsonhttp.HandleWithMsgs(h, 2 * time.Second))
}

type listResponse struct {
  Offset uint         `json:"pageOffset"`
  Limit uint          `json:"pageLimit"`
  Total uint          `json:"total"`
  Error bool          `json:"error"`
  Items []interface{} `json:"items"`
}

type ngHandler string
func (dir ngHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  http.ServeFile(w, r, fmt.Sprintf("%s/index.html", (string)(dir)))
}

func main() {
  var dbhost, dir string
  dialInfo := &mgo.DialInfo{}

  flag.StringVar(&dir, "dir", "/usr/src/myapp", "the directory to serve files from. Defaults to /usr/src/myapp")
  flag.StringVar(&dbhost, "dbhost", "mongodb", "mongodb host name. Defaults to mongodb")
  flag.StringVar(&dialInfo.Username, "dbuser", "ebisc", "mongodb user name. Defaults to ebisc")
  flag.StringVar(&dialInfo.Password, "dbpass", "ebisc", "mongodb password. Defaults to ebisc")
  flag.StringVar(&dialInfo.Database, "dbname", "ebisc", "mongodb database name. Defaults to ebisc")
  flag.Parse()

  dialInfo.Addrs = []string{dbhost}
  session, err := mgo.DialWithInfo(dialInfo)
  if err != nil {
    panic(err)
  }

  r := mux.NewRouter()
  api := r.PathPrefix("/api").Subrouter()

  addEndpoint(api, endpointTest,      handleTest() )
  addEndpoint(api, endpointExam,      handleExam(session) )
  addEndpoint(api, endpointExamList,  handleExamList(session) )
  addEndpoint(api, endpointQFails,    handleQFails(session) )
  addEndpoint(api, endpointLineFails, handleLineFails(session) )

  r.PathPrefix("/static/").Handler(http.FileServer(http.Dir(dir)))
  r.PathPrefix("/").Handler((ngHandler)(dir))

  srv := &http.Server{
    Handler: r,
    Addr: ":8000",
    WriteTimeout: 15 * time.Second,
    ReadTimeout:  15 * time.Second,
    // MaxHeaderBytes: 1 << 20, // Default
    // ErrorLog: 
  }

  log.Fatal(srv.ListenAndServe())

}

