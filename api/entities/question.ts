import { ObjectId } from "mongodb";
import { Field, InputType, ObjectType } from "type-graphql";

import {
  arrayProp as PropertyArray,
  getModelForClass,
  prop as Property,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

import { ObjectIdScalar } from "../utils/ObjectIdScalar";

@ObjectType()
export class Question extends TimeStamps {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  text: string;

  @Field(() => [String], { nullable: true })
  @PropertyArray({ items: String, default: undefined })
  alternatives?: string[];

  @Field()
  readonly updatedAt: Date;

  @Field()
  readonly createdAt: Date;
}

export const QuestionModel = getModelForClass(Question);

@InputType()
export class UpsertQuestion implements Partial<Question> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: ObjectId;

  @Field()
  text: string;

  @Field(() => [String], { nullable: true })
  alternatives?: string[];
}
