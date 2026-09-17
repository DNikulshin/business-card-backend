import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Skill } from './skill.model.js';
import { Experience } from './experience.model.js';
import { Project } from './project.model.js';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String, { nullable: true })
  github: string | null;

  @Field(() => String, { nullable: true })
  linkedin: string | null;

  @Field(() => String, { nullable: true })
  portfolio: string | null;

  @Field(() => [Skill])
  skills: Skill[];

  @Field(() => [Experience], { name: 'experience' })
  experiences: Experience[];

  @Field(() => [Project])
  projects: Project[];
}
