import { transformAndValidate } from "class-transformer-validator";
import { Router } from "express";
import validator from "validator";

import { readFileGridFS, uploadFileGridFS } from "../db/gridFS";
import { ChartModel, ChartUpload } from "../entities/chart";

export const ChartsRouter = Router();

const ChartsPrefix = "/charts";

ChartsRouter.get(`${ChartsPrefix}/:filename`, async (req, res) => {
  const { filename } = req.params;
  if (typeof filename !== "string" || filename?.length === 0) {
    return res.sendStatus(404);
  }

  const imageUrl = `${ChartsPrefix}/${filename}`;

  const [img, imgData] = await Promise.all([
    ChartModel.findOne({ imageUrl }),
    readFileGridFS({ filename: imageUrl }),
  ]);

  if (img && imgData) {
    res.type("image/png");
    imgData.pipe(res);
  } else {
    res.sendStatus(404);
  }
});

ChartsRouter.post("/upload", async (req, res) => {
  try {
    const chartUploads = await transformAndValidate(ChartUpload, req.body);

    for (const chart of Array.isArray(chartUploads)
      ? chartUploads
      : [chartUploads]) {
      const base64Image = chart.image.split("data:image/png;base64,")[1];
      if (!validator.isBase64(base64Image ?? "")) {
        throw new Error("Not valid Base64 image!");
      }
      const imageUrl = `${ChartsPrefix}/${validator.escape(chart.title)}.png`;
      const uploadedChart = ChartModel.findOneAndUpdate(
        {
          title: chart.title,
        },
        {
          title: chart.title,
          tags: chart.tags ?? [],
          imageUrl,
        },
        {
          upsert: true,
          new: true,
        }
      );
      const imgBuffer = Buffer.from(base64Image, "base64");
      const uploadedFile = await uploadFileGridFS(
        imgBuffer,
        imageUrl,
        (await uploadedChart)._id
      );

      return res.status(200).send({ ...uploadedFile, imageUrl });
    }
  } catch (err) {
    return res.status(422).send(err?.message ?? JSON.stringify(err, null, 2));
  }
});
