import assert, { AssertionError } from "assert";
import encodeurl from "encodeurl";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import mime from "mime";
import requireEnv from "require-env-variable";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { uploadFileGridFSStream } from "../db/gridFS";
import { Chart, ChartModel, ChartUpload } from "../entities/chart";
import { IContext } from "../interfaces";
import { ChartsPrefix } from "../routes/charts";
import { assertIsDefined } from "../utils";

const { UPLOAD_CHART_CREDENTIALS } = requireEnv("UPLOAD_CHART_CREDENTIALS");

@Resolver(() => Chart)
export class ChartResolver {
  @Query(() => [Chart])
  async charts() {
    return await ChartModel.find({});
  }

  @Query(() => [String])
  async tags() {
    return await ChartModel.distinct("tags");
  }

  @Mutation(() => Chart)
  async uploadChart(
    @Arg("file", () => GraphQLUpload)
    { filename, createReadStream }: FileUpload,
    @Arg("data", () => ChartUpload)
    { tags, title }: Pick<ChartUpload, "title" | "tags">,
    @Ctx() { req }: IContext,
    @Arg("oldTitle", { nullable: true }) oldTitle?: string
  ) {
    if (req.headers.authorization !== UPLOAD_CHART_CREDENTIALS) {
      throw new Error("Not Authorized!");
    }
    assert(
      filename,
      new AssertionError({
        message: "File not valid!",
      })
    );

    const mimetype = mime.getType(filename);

    assertIsDefined(mimetype, "MIME type of the file could not be recognized!");

    const extension = mime.getExtension(mimetype);

    assertIsDefined(
      extension,
      "Extension of the file could not be recognized!"
    );

    switch (extension) {
      case "png":
        break;
      default:
        throw new Error("The File should be PNG!");
    }
    const imageUrl = `${ChartsPrefix}/${encodeurl(filename)}`;
    try {
      let uploadedChart = await ChartModel.findOne({
        title: oldTitle || title,
      });
      if (uploadedChart === null) {
        uploadedChart = await ChartModel.create({
          title,
          tags,
          imageUrl,
        });
      } else {
        uploadedChart.title = title;
        uploadedChart.tags = tags;
        uploadedChart.imageUrl = imageUrl;
        await uploadedChart.save();
      }

      await uploadFileGridFSStream(
        createReadStream(),
        imageUrl,
        uploadedChart._id
      );
      return uploadedChart;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
