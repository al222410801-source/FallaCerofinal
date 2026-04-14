import {Query, Resolver} from '@nestjs/graphql';

@Resolver()
export class FallaCeroResolver {
  @Query(() => String, {description: "API GraphQL FallaCero - Sistema de denuncias", name: "fallaCeroVersion"})
  version(): string {
    return "FallaCero API v1.0";
  }
}
