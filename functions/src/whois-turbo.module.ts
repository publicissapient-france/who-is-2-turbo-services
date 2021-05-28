import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { FirebaseTokenMiddleware } from './middleware/firebase-token-middleware.service';

@Module({
  imports: [ApplicationModule, DomainModule, InfrastructureModule],
})
export class WhoisTurboModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirebaseTokenMiddleware).forRoutes('*');
  }
}
