## **Tổng quan**

Trong NestJS, việc xác thực (validation) dữ liệu đầu vào là một phần cực kỳ quan trọng để đảm bảo tính toàn vẹn và đúng đắn của dữ liệu mà ứng dụng của bạn nhận được. NestJS cung cấp một cơ chế mạnh mẽ để thực hiện việc này thông qua `ValidationPipe`, kết hợp với các thư viện `class-validator` và `class-transformer`. **DTO (Data Transfer Object)** là một mẫu thiết kế được sử dụng để đóng gói dữ liệu và vận chuyển nó giữa các lớp trong ứng dụng.

---

## **1. DTO (Data Transfer Object)**

**Khái niệm:**

- **DTO** là một đối tượng dùng để truyền dữ liệu giữa các tiến trình. Trong ngữ cảnh của NestJS, DTO thường được sử dụng để định hình dữ liệu được gửi trong body của các request HTTP (ví dụ: POST, PUT).
- Mục đích chính của DTO là tạo ra một "hợp đồng" rõ ràng về cấu trúc dữ liệu mà một endpoint mong đợi nhận được.
- Việc sử dụng DTO giúp tách biệt tầng controller (nơi xử lý request) với tầng business logic và tầng dữ liệu.

**Ví dụ:**

Giả sử chúng ta có một endpoint để tạo một người dùng mới. Chúng ta có thể định nghĩa một `CreateUserDto` như sau:

```typescript
// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  name: string
  email: string
  age: number
}
```

Trong controller, chúng ta có thể sử dụng DTO này:

```typescript
// src/users/users.controller.ts
import { Controller, Post, Body } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('users')
export class UsersController {
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // Logic để tạo người dùng mới
    return `This action adds a new user with name: ${createUserDto.name}`
  }
}
```

---

## **2. `class-validator`**

**Khái niệm:**

- `class-validator` là một thư viện cho phép bạn sử dụng các decorator để xác thực các thuộc tính của một class.
- Nó cung cấp một loạt các decorator cho các quy tắc xác thực phổ biến (ví dụ: chuỗi không được rỗng, email hợp lệ, số nguyên, v.v.).
- NestJS tích hợp rất tốt với `class-validator` thông qua `ValidationPipe`.

**Ví dụ:**

Bây giờ, hãy thêm các quy tắc xác thực vào `CreateUserDto` của chúng ta bằng cách sử dụng các decorator từ `class-validator`:

```typescript
// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, IsInt, Min, Max } from 'class-validator'

export class CreateUserDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsInt()
  @Min(18)
  @Max(99)
  age: number
}
```

Trong ví dụ trên:

- `@IsString()`: Đảm bảo `name` là một chuỗi.
- `@IsEmail()`: Đảm bảo `email` là một địa chỉ email hợp lệ.
- `@IsInt()`: Đảm bảo `age` là một số nguyên.
- `@Min(18)`: Đảm bảo `age` không nhỏ hơn 18.
- `@Max(99)`: Đảm bảo `age` không lớn hơn 99.

---

## **3. `class-transformer`**

**Khái niệm:**

- `class-transformer` là một thư viện cho phép bạn chuyển đổi một đối tượng JavaScript thuần (plain JavaScript object) thành một instance của một class, và ngược lại.
- Nó thường được sử dụng cùng với `class-validator` để đảm bảo rằng dữ liệu đầu vào không chỉ hợp lệ mà còn được chuyển đổi sang đúng kiểu dữ liệu mà bạn mong đợi.

**Ví dụ:**

Khi một request được gửi đến ứng dụng NestJS của bạn, body của request là một đối tượng JavaScript thuần. `class-transformer` sẽ lấy đối tượng này và biến nó thành một instance của `CreateUserDto`, cho phép `class-validator` thực hiện việc xác thực.

Một ví dụ khác về `class-transformer` là việc chuyển đổi kiểu dữ liệu. Ví dụ, các tham số từ URL (params) hoặc query string luôn là chuỗi. `class-transformer` có thể tự động chuyển đổi chúng thành số.

---

## **4. Validator và `ValidationPipe`**

**Khái niệm:**

- Trong NestJS, **Pipes** là các class có decorator `@Injectable()` và implement interface `PipeTransform`. Chúng được sử dụng để chuyển đổi (transformation) và xác thực (validation) dữ liệu đầu vào.
- `ValidationPipe` là một pipe được xây dựng sẵn trong NestJS, nó sử dụng `class-validator` và `class-transformer` để tự động xác thực và chuyển đổi payload của request.

**Cách sử dụng:**

Để kích hoạt `ValidationPipe`, bạn cần đăng ký nó ở một trong các cấp độ sau:

- **Toàn cục (Global):** Áp dụng cho tất cả các route trong ứng dụng của bạn.

<!-- end list -->

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe()) // Đăng ký ValidationPipe toàn cục
  await app.listen(3000)
}
bootstrap()
```

- **Cấp độ Controller:** Áp dụng cho tất cả các handler trong một controller.
- **Cấp độ Route Handler:** Áp dụng cho một route handler cụ thể.

**Tự động chuyển đổi (Auto-transformation):**

Một tính năng mạnh mẽ của `ValidationPipe` là khả năng tự động chuyển đổi payload thành các instance của DTO. Để bật tính năng này, bạn cần đặt tùy chọn `transform` thành `true`:

```typescript
// src/main.ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  }),
)
```

Với `transform: true`, `ValidationPipe` sẽ:

1.  **Xác thực payload** dựa trên các decorator trong DTO.
2.  **Chuyển đổi payload** thành một instance của class DTO tương ứng.
3.  **Chuyển đổi kiểu dữ liệu nguyên thủy**. Ví dụ, nếu một tham số trong query string được định nghĩa là `number` trong DTO, `ValidationPipe` sẽ tự động chuyển đổi chuỗi từ query string thành số.

**Ví dụ hoàn chỉnh:**

Hãy xem cách tất cả các khái niệm này hoạt động cùng nhau.

1.  **Định nghĩa DTO với validation:**

<!-- end list -->

```typescript
// src/items/dto/create-item.dto.ts
import { IsString, IsInt, Min } from 'class-validator'

export class CreateItemDto {
  @IsString()
  name: string

  @IsInt()
  @Min(0)
  price: number
}
```

2.  **Sử dụng DTO trong Controller:**

<!-- end list -->

```typescript
// src/items/items.controller.ts
import { Controller, Post, Body } from '@nestjs/common'
import { CreateItemDto } from './dto/create-item.dto'

@Controller('items')
export class ItemsController {
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    console.log(createItemDto instanceof CreateItemDto) // Sẽ là true nếu transform: true
    return `Item created with name: ${createItemDto.name} and price: ${createItemDto.price}`
  }
}
```

3.  **Kích hoạt `ValidationPipe` toàn cục:**

<!-- end list -->

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  await app.listen(3000)
}
bootstrap()
```

**Luồng hoạt động:**

1.  Client gửi một request `POST` đến `/items` với body:
    - **Request hợp lệ:** `{ "name": "My Item", "price": 100 }`
    - **Request không hợp lệ:** `{ "name": "My Item", "price": -10 }`

2.  `ValidationPipe` sẽ chặn request.

3.  `class-transformer` sẽ cố gắng chuyển đổi body của request thành một instance của `CreateItemDto`.

4.  `class-validator` sẽ kiểm tra instance của `CreateItemDto`:
    - Trong trường hợp request hợp lệ, validation thành công. Dữ liệu được chuyển đến `create` handler trong `ItemsController`.
    - Trong trường hợp request không hợp lệ, `ValidationPipe` sẽ ném ra một `BadRequestException` với thông báo lỗi chi tiết, ví dụ:

<!-- end list -->

```json
{
  "statusCode": 400,
  "message": ["price must not be less than 0"],
  "error": "Bad Request"
}
```

Hy vọng lời giải thích chi tiết này sẽ giúp bạn hiểu rõ hơn về các khái niệm quan trọng này trong NestJS\!
