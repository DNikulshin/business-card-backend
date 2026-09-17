import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Experience {
  @Field(() => ID)
  id: number;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field()
  period: string;

  @Field(() => String, { nullable: true })
  achievements?: string | null;
}
