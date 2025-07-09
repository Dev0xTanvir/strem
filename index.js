const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    const targetpath = path.join(__dirname, "Public", "index.html");
    const readstrem = fs.createReadStream(targetpath);

    readstrem.on("data", (chank) => {
      res.write(chank);
    });
    readstrem.on("end", () => {
      console.log("data read done");
      res.end();
    });
    readstrem.on("error", (err) => {
      console.log("error from write file", err);
    });
  } else if (req.url == "/video") {
    const videopath = path.join(__dirname, "video", "Constantine.mkv");
    const filestatus = fs.statSync(videopath);
    const filesize = filestatus.size;
    // renge
    const range = req.headers.range;
    const videorange = range.replace(/bytes=/, "").split("-");
    const start = parseInt(videorange[0], 10);
    const end = videorange[1] ? parseInt(videorange[1], 10) : filesize - 1;
    const chunksize = end - start + 1;

    res.writeHead(206, {
      "Content-Type": "video/x-matroska",
      "content-range": `bytes ${start}-${end}/${filesize}`,
      "accept-ranges": "bytes",
      "content-length": chunksize,
    });

    // strem create

    const strem = fs.createReadStream(videopath, { start, end });
    strem.on("data", (chunk) => res.write(chunk));
    strem.on("end", () => res.end());
    strem.on("error", (err) => console.log(err));
  }
});

server.listen(4000, () => {
  console.log(`this is my server : host : http://localhost:4000`);
});
