import { Query, Resolver } from "type-graphql";

import { Chart, ChartModel } from "../entities/chart";

@Resolver(() => Chart)
export class ChartResolver {
  @Query(() => [Chart])
  async charts() {
    return await ChartModel.find({});
  }
}
