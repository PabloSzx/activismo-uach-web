import { ObjectId } from "mongodb";
import { Field, InputType, ObjectType } from "type-graphql";

import {
  arrayProp as PropertyArray,
  getModelForClass,
  prop as Property,
  Ref,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

import { ObjectIdScalar } from "../utils/ObjectIdScalar";
import { Question } from "./question";

@ObjectType()
export class Form extends TimeStamps {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  name: string;

  @Field(() => [Question])
  @PropertyArray({
    items: "Question",
    ref: "Question",
    default: [],
    _id: false,
  })
  questions: Ref<Question>[];

  @Field()
  @Property({ default: true })
  active: boolean;

  @Field()
  readonly updatedAt: Date;

  @Field()
  readonly createdAt: Date;
}

export const FormModel = getModelForClass(Form);

@InputType()
export class UpsertForm implements Partial<Form> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: ObjectId;

  @Field()
  name: string;

  @Field(() => [ObjectIdScalar])
  questions: ObjectId[];
}
