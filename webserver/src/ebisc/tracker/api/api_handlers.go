package api

import (
    "gopkg.in/mgo.v2"
    "gopkg.in/mgo.v2/bson"
    "time"
    "net/url"
    "strconv"
)
func testHandlerFn(vars map[string]string, form url.Values, db *mgo.Session) *apiResponse{
  res := map[string]interface{}{
    "error": false,
    "text": "this is a test",
  }
  return newOKRes(res)
}

func examHandlerFn(vars map[string]string, form url.Values, session *mgo.Session) *apiResponse{

  c := session.DB("ebisc").C("exam")
  m := make(bson.M)
  if dateStr := vars["date"]; len(dateStr) > 0 {
    if date, err := time.Parse(time.RFC3339Nano, dateStr); err != nil {
      return newBadRequestRes("Date not valid RFC3339Nano")
    } else {
      if err := c.Find(bson.M{"date": date}).One(&m); err != nil {
        if (err == mgo.ErrNotFound) {
          return newNotFoundRes()
        }
        panic(newApiError(err, "Database find error"))
      }
    }
  } else {
    if err := c.Find(nil).Sort("-date").One(&m); err != nil {
      panic(newApiError(err, "Database find error"))
    }
  }

  if qSlice, ok := m["questions"].([]interface{}); ok {
    for _, q := range qSlice {
      if bsonQ, ok := q.(bson.M); !ok {
        panic(newApiError("type conversion of Question to a map", "Unexpected json structure"))
      } else {
        expandQuestion(bsonQ, session)
      }
    }
  }

  delete(m, "_id")
  m["error"] = false
  
  return newOKRes(m)
}

func expandQuestion(q bson.M, session *mgo.Session) {
  c := session.DB("ebisc").C("question")
  if err := c.Find(bson.M{"module": q["module"]}).Select(bson.M{"title": 1, "description": 1, "_id": 0}).One(&q); err != nil {
    if (err == mgo.ErrNotFound) {
      return // Not an error
    }
    panic(newApiError(err, "Database find error"))
  }
}

func examListHandlerFn(vars map[string]string, form url.Values, session *mgo.Session) *apiResponse{
  c := session.DB("ebisc").C("exam")
  var query bson.M = nil
  if dateStr := form.Get("date"); len(dateStr) > 0 {
    if date, err := time.Parse(time.RFC3339Nano, dateStr); err != nil {
      return newBadRequestRes("Date not valid RFC3339Nano")
    } else {
      query = bson.M{"date": bson.M{"$lt": date}};
    }
  }
  var items []interface{}
  if err := c.Find(query).Sort("-date").Limit(10).Select(bson.M{"date": 1, "_id": 0}).All(&items); err != nil {
    panic(newApiError(err, "Database find error"))
  }
  m := bson.M{"items": items, "error": false}
  return newOKRes(m)
}

func failHandlerFn(vars map[string]string, form url.Values, session *mgo.Session) *apiResponse{
  c := session.DB("ebisc").C("question_fail")
  queryParams := bson.M{};

  if date, err := time.Parse(time.RFC3339Nano, vars["date"]); err != nil {
    return newBadRequestRes("Date not valid RFC3339Nano")
  } else {
    queryParams["date"] = date
  }
  if str := form.Get("cell_line"); len(str) > 0 {
    queryParams["cellLine"] = str
  }
  if str := form.Get("batch"); len(str) > 0 {
    queryParams["batch"] = str
  }
  if str := form.Get("module"); len(str) > 0 {
    queryParams["module"] = str
  }

  query := c.Find(queryParams);
  m := bson.M{}

  if n, err := query.Count(); err != nil {
    panic(newApiError(err, "Database error"))
  } else {
    m["total"] = n
  }

  query = query.Sort("_id").Limit(100).Select(bson.M{"_id": 0})

  if skipStr := form.Get("offset"); len(skipStr) > 0 {
    if skip, err := strconv.Atoi(skipStr); err != nil{
      return newBadRequestRes("skip not a valid integer")
    } else {
      query = query.Skip(skip)
      m["pageOffset"] = skip
    }
  } else {
    m["pageOffset"] = 0
  }

  if limitStr := form.Get("limit"); len(limitStr) > 0 {
    if limit, err := strconv.Atoi(limitStr); err != nil{
      return newBadRequestRes("limit not a valid integer")
    } else {
      m["pageLimit"] = limit
      query = query.Limit(limit)
    }
  } else {
    m["pageLimit"] = 100
    query = query.Limit(100)
  }

  var items []interface{}
  if err := query.All(&items); err != nil {
    panic(newApiError(err, "Database find error"))
  }
  m["items"] = items
  m["error"] = false
  return newOKRes(m)
}

func lineFailHandlerFn(vars map[string]string, form url.Values, session *mgo.Session) *apiResponse{
  c := session.DB("ebisc").C("question_fail")
  m := bson.M{}
  var items []interface{}

  queryParams := bson.M{}
  if date, err := time.Parse(time.RFC3339Nano, vars["date"]); err != nil {
    return newBadRequestRes("Date not valid RFC3339Nano")
  } else {
    queryParams["date"] = date
  }
  if moduleStr := form.Get("module"); len(moduleStr) > 0 {
    queryParams["module"] = moduleStr
  }

  skip := 0
  if skipStr := form.Get("offset"); len(skipStr) > 0 {
    var err error 
    if skip, err = strconv.Atoi(skipStr); err != nil{
      return newBadRequestRes("skip not a valid integer")
    }
  }
  limit := 100
  if limitStr := form.Get("limit"); len(limitStr) > 0 {
    var err error 
    if limit, err = strconv.Atoi(limitStr); err != nil{
      return newBadRequestRes("limit not a valid integer")
    }
  }

  o1 := bson.M{"$match": queryParams}

  oDistinct2 := bson.M{"$group": bson.M{"_id": "$cellLine"}}
  oDistinct3 := bson.M{"$group": bson.M{"_id": nil, "count": bson.M{"$sum": 1}}}
  operationsDistinct := []bson.M{o1,oDistinct2, oDistinct3}
  pipeDistinct := c.Pipe(operationsDistinct)
  distinct := bson.M{}
  if err := pipeDistinct.One(&distinct); err != nil {
    if (err == mgo.ErrNotFound) {
      m["total"] = 0
    } else {
      panic(newApiError(err, "Database find error"))
    }
  } else {
    m["total"] = distinct["count"]

    o2 := bson.M{
      "$group": bson.M{"_id": "$cellLine",  "modules": bson.M{"$addToSet": "$module"}},
    }
    o3 := bson.M{
      "$project": bson.M{"cellLine": "$_id", "modules": 1, "count": bson.M{"$size": "$modules"}},
    }
    o4 := bson.M{
      "$sort": bson.D{{"count", 1}, {"cellLine", 1}},
    }
    o5 := bson.M{"$skip": skip}
    o6 := bson.M{"$limit": limit}

    o7 := bson.M{
      "$project": bson.M{"cellLine": 1, "modules": 1, "_id": 0},
    }

    operations := []bson.M{o1,o2,o3,o4,o5,o6,o7}
    pipe := c.Pipe(operations)

    if err := pipe.All(&items); err != nil {
      panic(newApiError(err, "Database find error"))
    }
  }

  m["items"] = items
  m["pageLimit"] = limit
  m["pageOffset"] = skip
  m["error"] = false
  return newOKRes(m)
}

