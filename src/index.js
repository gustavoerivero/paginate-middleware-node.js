import express from "express";

import db from "./db/db.js";
import User from "./model/User.js";

const app = express();

db();

const paginate = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page ?? -1);
    const limit = parseInt(req.query.limit ?? 10);

    if (page == -1) {

      const result = {};

      const documents = await model.find();

      result.Data = documents;
      res.paginatedResult = result;
      next();

    } else {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const searchTerm = req.query.search ?? '';

      const result = {};

      try {

        const totalDocuments = await model.countDocuments({
          ...(searchTerm ? { [searchTerm]: { $regex: new RegExp(searchTerm, 'i') } } : {})
        }).exec();

        const query = searchTerm ? { [searchTerm]: { $regex: new RegExp(searchTerm, 'i') } } : {};

        const documents = await model.find(query)
          .limit(limit)
          .skip(startIndex)
          .exec();


        const rest = totalDocuments - (page * limit);

        result.firstPage = 1;
        result.currentPage = page;
        result.lastPage = Math.round(totalDocuments / limit)

        result.next = {
          page: endIndex < totalDocuments ? page + 1 : null,
          limit: rest >= 0 ? rest : 0
        }

        let pagePrevious = 0;

        if (startIndex > 0 && (rest >= 0 && rest <= totalDocuments)) {
          pagePrevious = page - 1;
        } else {
          pagePrevious = Math.round(totalDocuments / limit);
        }

        result.previous = {
          page: startIndex > 0 ? pagePrevious : null,
          limit: startIndex > 0 ? limit : null,
        }

        result.total = totalDocuments;

        result.Data = documents;

        res.paginatedResult = result;
        next();
      } catch (e) {
        res.status(500).json({ message: e.message });
      }

    }

  };

}

app.get("/", (req, res) => {
  res.json("Hello world!");
});

app.get("/users", paginate(User), (req, res) => {
  res.json(res.paginatedResult);
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});