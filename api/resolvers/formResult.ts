import { ObjectId } from "mongodb";
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { isDocument } from "@typegoose/typegoose";

import { FormModel } from "../entities/form";
import {
  Answer,
  FormResult,
  FormResultInput,
  FormResultModel,
} from "../entities/formResult";
import { QuestionModel } from "../entities/question";
import { ObjectIdScalar } from "../utils/ObjectIdScalar";

@Resolver(() => FormResult)
export class FormResultResolver {
  @Query(() => [FormResult])
  async formResults(
    @Arg("form_id", () => ObjectIdScalar, { nullable: true }) form_id?: ObjectId
  ) {
    if (form_id) {
      return await FormResultModel.find({
        form: form_id,
      });
    }
    return await FormResultModel.find({});
  }

  @Mutation(() => FormResult)
  async answerForm(
    @Arg("data") { form, answers, latitude, longitude }: FormResultInput
  ) {
    return await FormResultModel.create({
      form,
      latitude,
      longitude,
      answers,
    });
  }

  @FieldResolver()
  async form(@Root() { form }: Partial<FormResult>) {
    if (form) {
      if (isDocument(form)) {
        return form;
      }
      return FormModel.findById(form);
    }
    return null;
  }
}

@Resolver(() => Answer)
export class AnswerResolver {
  @FieldResolver()
  async question(@Root() { question }: Partial<Answer>) {
    if (question) {
      if (isDocument(question)) {
        return question;
      }
      return QuestionModel.findById(question);
    }
    return null;
  }
}
