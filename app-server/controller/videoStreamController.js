const express = require('express');
const authenticateLoginToken = require('../middlewares/authorization');

const router = express.Router();

router.use(authenticateLoginToken);

const videoDB = new Map({
    "welcome": "./welcome.mp4",
    "end": "./end.mp4",
})


/**
 * Handles the route for serving video files.
 *
 * @param {string} req.params.name - The name of the video file to be served.
 * @param {number} [req.body.start] - The starting byte offset for the video stream.
 * @param {number} [req.body.end] - The ending byte offset for the video stream.
 * @returns {void} - Streams the requested video file to the client.
 */
router.get("/video/:name", async (req, res) => {
  try {
    const videoName = req.params.name;

    if (!videoDB.has(videoName)) {
      res.status(404).json({ error: "Video Not Found!" });
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const videoPath = videoDB.get(videoName);
    const videoSize = fs.statSync(videoPath).size;

    let { start, end } = req.body;

    if (!start) {
      start = Number(range.replace(/\D/g, ""));
    }

    if (!end) {
      end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    }

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});


module.exports = router;
