import assert, { AssertionError } from "assert";
import { ObjectId } from "mongodb";
import requireEnv from "require-env-variable";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { Question, QuestionModel, UpsertQuestion } from "../entities/question";
import { IContext } from "../interfaces";
import { assertIsDefined } from "../utils";
import { ObjectIdScalar } from "../utils/ObjectIdScalar";

const { UPDATE_FORM_CREDENTIALS } = requireEnv("UPDATE_FORM_CREDENTIALS");

@Resolver(() => Question)
export class QuestionResolver {
  @Query(() => [Question])
  async questions() {
    return await QuestionModel.find({});
  }

  @Query(() => Question, { nullable: true })
  async question(
    @Arg("_id", () => ObjectIdScalar, { nullable: true }) _id?: ObjectId,
    @Arg("text", { nullable: true }) text?: string
  ) {
    assertIsDefined(
      _id || text,
      "You should specify at least one of _id or name"
    );
    if (_id) {
      return await QuestionModel.findById(_id);
    } else {
      return await QuestionModel.findOne({
        text,
      });
    }
  }

  @Mutation(() => Question)
  async upsertQuestion(
    @Ctx() { req }: IContext,
    @Arg("data") { _id, text, alternatives }: UpsertQuestion
  ) {
    assert(
      req.headers.authorization === UPDATE_FORM_CREDENTIALS,
      new AssertionError({
        message: "Not authorized!",
      })
    );

    if (_id) {
      const question = await QuestionModel.findByIdAndUpdate(
        _id,
        {
          text,
          alternatives,
        },
        {
          new: true,
        }
      );
      assertIsDefined(question, `Question not found!`);
      return question;
    } else {
      const question = await QuestionModel.findOneAndUpdate(
        {
          text,
        },
        {
          text,
          alternatives,
        },
        {
          upsert: true,
          new: true,
        }
      );
      return question;
    }
  }
}
