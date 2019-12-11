import assert, { AssertionError } from "assert";
import { ObjectId } from "mongodb";
import requireEnv from "require-env-variable";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { isDocumentArray } from "@typegoose/typegoose";

import { Form, FormModel, UpsertForm } from "../entities/form";
import { QuestionModel } from "../entities/question";
import { IContext } from "../interfaces";
import { assertIsDefined } from "../utils";
import { ObjectIdScalar } from "../utils/ObjectIdScalar";

const { UPDATE_FORM_CREDENTIALS } = requireEnv("UPDATE_FORM_CREDENTIALS");

@Resolver(() => Form)
export class FormResolver {
  @Query(() => [Form])
  async forms() {
    return await FormModel.find({});
  }

  @Query(() => Form, { nullable: true })
  async form(
    @Arg("id", () => ObjectIdScalar, { nullable: true }) id?: ObjectId,
    @Arg("name", { nullable: true }) name?: string
  ) {
    if (id) {
      return await FormModel.findById(id);
    } else if (name) {
      return await FormModel.findOne({
        name,
      });
    }
    return null;
  }

  @Mutation(() => Form)
  async upsertForm(
    @Ctx() { req }: IContext,
    @Arg("data") { _id, name, questions }: UpsertForm
  ) {
    assert(
      req.headers.authorization === UPDATE_FORM_CREDENTIALS,
      new AssertionError({
        message: "Not authorized!",
      })
    );
    if (_id) {
      const form = await FormModel.findByIdAndUpdate(
        _id,
        {
          name,
          questions,
        },
        {
          new: true,
        }
      );

      assertIsDefined(form, `Form not found!`);

      return form;
    } else {
      const form = await FormModel.findOneAndUpdate(
        { name },
        {
          name,
          questions,
        },
        {
          upsert: true,
          new: true,
        }
      );

      return form;
    }
  }

  @FieldResolver()
  async questions(@Root() { questions }: Partial<Form>) {
    if (questions) {
      if (isDocumentArray(questions)) {
        return questions;
      }
      return QuestionModel.find({
        _id: {
          $in: questions,
        },
      });
    }
    return [];
  }
}
