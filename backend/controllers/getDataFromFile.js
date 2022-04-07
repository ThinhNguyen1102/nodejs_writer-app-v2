const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "noteStorage.json"
);

const _storage = {
  getData: () => {
    return new Promise((resolve, reject) => {
      fs.readFile(p, (err, data) => {
        if (err) {
          reject({ errMessage: `Error reading file from disk: ${err}` });
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  },
  saveData: (data) => {
    return new Promise((resolve, reject) => {
      const dataWrite = data ? data : [];
      fs.writeFile(p, JSON.stringify(dataWrite), (err) => {
        if (err) {
          reject({ errMessage: `Error reading file from disk: ${err}` });
        } else {
          resolve({ ...data, message: "Successfully" });
        }
      });
    });
  },
};

module.exports = _storage;
