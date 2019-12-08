import { Transform } from "class-transformer";
import {
  Contains,
  IsArray,
  IsBase64,
  IsOptional,
  MinLength,
} from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@ObjectType()
export class Chart extends TimeStamps {
  @Property({ required: true })
  @Field()
  title: string;

  @Property({ required: true, index: true })
  @Field()
  imageUrl: string;

  @Property({ default: [] })
  @Field(() => [String])
  tags: string[];

  @Field(() => Date)
  updatedAt: Readonly<Date>;

  @Field(() => Date)
  createdAt: Readonly<Date>;
}

export const ChartModel = getModelForClass(Chart);

@InputType()
export class ChartUpload {
  @Field()
  @MinLength(1)
  title: string;

  @Contains("data:image/png;base64,")
  image: string;

  @Field(() => [String], { defaultValue: [] })
  @IsOptional()
  @MinLength(1, { each: true })
  @IsArray()
  tags: string[];
}
