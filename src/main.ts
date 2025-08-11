import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import envConfig from 'src/shared/config'
import { ValidationPipe } from '@nestjs/common'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`server run success with port: ${envConfig.PORT}`)
  })
}
bootstrap()
