import { ObjectId } from "mongodb";
import { Field, InputType, ObjectType } from "type-graphql";
import { DeepPartial } from "utility-types";

import {
  arrayProp as PropertyArray,
  getModelForClass,
  prop as Property,
  Ref,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

import { ObjectIdScalar } from "../utils/ObjectIdScalar";
import { Form } from "./form";
import { Question } from "./question";

@ObjectType()
export class Answer {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field(() => Question, { nullable: true })
  @Property({ ref: "Question" })
  question?: Ref<Question>;

  @Field()
  @Property()
  answer: string;
}

@ObjectType()
export class FormResult extends TimeStamps {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field(() => Form, { nullable: true })
  @Property({ ref: "Form" })
  form?: Ref<Form>;

  @Field({ nullable: true })
  @Property()
  scope?: string;

  @Field({ nullable: true })
  @Property()
  email?: string;

  @Field(() => [Answer])
  @PropertyArray({ items: Answer, default: [] })
  answers: Answer[];

  @Field()
  readonly updatedAt: Date;

  @Field()
  readonly createdAt: Date;
}

export const FormResultModel = getModelForClass(FormResult);

@InputType()
export class AnswerInput implements Partial<Answer> {
  @Field(() => ObjectIdScalar)
  question: ObjectId;

  @Field()
  answer: string;
}

@InputType()
export class FormResultInput implements DeepPartial<FormResult> {
  @Field(() => ObjectIdScalar)
  form: ObjectId;

  @Field({ nullable: true })
  scope?: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => [AnswerInput])
  answers: AnswerInput[];
}
