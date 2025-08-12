import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
//check exists file env

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không tìm thấy file .env')
  process.exit(1)
}

export class ConfigSchema {
  @IsString()
  DATABASE_URL: string
  @IsString()
  PORT: number
  @IsString()
  ACCESS_TOKEN_SECRET: string
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string
  @IsString()
  REFRESH_TOKEN_SECRET: string
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
  @IsString()
  API_KEY_SECRET: string
}
const configServer = plainToInstance(ConfigSchema, process.env)

const e = validateSync(configServer)
if (e.length > 0) {
  console.log('Giá trị env Không hợp lệ')
  const envErrors = e.map((eItem) => {
    return {
      property: eItem.property,
      constraints: eItem.constraints,
      value: eItem.value,
    }
  })
  throw envErrors
}
const envConfig = configServer
export default envConfig
