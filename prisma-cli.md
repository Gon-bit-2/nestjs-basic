# Tổng hợp các lệnh Prisma CLI quan trọng

Prisma CLI (`@prisma/cli`) là một công cụ dòng lệnh không thể thiếu trong hệ sinh thái Prisma. Nó giúp bạn quản lý toàn bộ vòng đời của cơ sở dữ liệu, từ việc khởi tạo, thiết kế lược đồ, di chuyển (migration), tạo client cho đến việc tương tác trực tiếp với dữ liệu.

Dưới đây là danh sách các lệnh quan trọng được phân loại theo chức năng để bạn dễ dàng tra cứu và sử dụng.

## 🚀 Khởi tạo và Thiết lập

Nhóm lệnh này giúp bạn bắt đầu một dự án Prisma mới.

### `prisma init`

Đây là lệnh đầu tiên bạn sẽ chạy. Nó thiết lập cấu trúc thư mục và các tệp cơ bản cho một dự án Prisma.

- **Chức năng:**
  - Tạo một thư mục `prisma` chứa tệp `schema.prisma`.
  - Tạo một tệp `.env` ở thư mục gốc để lưu trữ chuỗi kết nối cơ sở dữ liệu (`DATABASE_URL`).
- **Sử dụng:**
  ```bash
  npx prisma init
  ```

---

## Schema & Migrations

Đây là trái tim của Prisma CLI, cho phép bạn phát triển và quản lý lược đồ cơ sở dữ liệu một cách an toàn và có phiên bản.

### `prisma migrate dev`

Lệnh chính được sử dụng trong quá trình phát triển. Nó so sánh `schema.prisma` với trạng thái cơ sở dữ liệu, tạo một tệp di chuyển mới và áp dụng nó.

- **Chức năng:**
  1.  Tạo một tệp di chuyển SQL mới dựa trên thay đổi của lược đồ.
  2.  Áp dụng các thay đổi vào cơ sở dữ liệu.
  3.  Tự động chạy `prisma generate` để cập nhật Prisma Client.
- **Sử dụng:**

  ```bash
  # Tạo và áp dụng migration với tên tự động
  npx prisma migrate dev

  # Tạo và áp dụng migration với tên tùy chỉnh
  npx prisma migrate dev --name init-user-model
  ```

- ⚠️ **Lưu ý:** Lệnh này có thể cảnh báo nếu phát hiện thay đổi có thể gây mất dữ liệu. Chỉ nên dùng trong môi trường phát triển.

### `prisma migrate deploy`

Lệnh được thiết kế riêng cho môi trường sản xuất (production) và CI/CD.

- **Chức năng:**
  - Chỉ áp dụng các tệp di chuyển (migrations) chưa được thực thi vào cơ sở dữ liệu.
  - Nó sẽ không tự động tạo tệp di chuyển mới.
- **Sử dụng:**
  ```bash
  npx prisma migrate deploy
  ```

### `prisma db push`

Đồng bộ hóa `schema.prisma` với cơ sở dữ liệu mà **không tạo tệp di chuyển**.

- **Chức năng:**
  - Làm cho lược đồ cơ sở dữ liệu khớp với `schema.prisma` của bạn.
- **Sử dụng:**
  ```bash
  npx prisma db push
  ```
- 💡 **Trường hợp sử dụng:** Rất hữu ích cho việc tạo mẫu nhanh (prototyping) hoặc trong các dự án không yêu cầu lịch sử di chuyển (ví dụ: các dự án phụ). **Không nên sử dụng trong môi trường production.**

### `prisma migrate reset`

Đặt lại cơ sở dữ liệu về trạng thái ban đầu.

- **Chức năng:**
  - Xóa cơ sở dữ liệu (nếu có thể) và tạo lại.
  - Áp dụng lại tất cả các tệp di chuyển từ đầu.
- **Sử dụng:**
  ```bash
  npx prisma migrate reset
  ```

---

## ⚙️ Prisma Client

Lệnh này tạo ra thư viện truy vấn cơ sở dữ liệu được tối ưu và an toàn về kiểu (type-safe).

### `prisma generate`

Đọc tệp `schema.prisma` và tạo hoặc cập nhật Prisma Client trong `node_modules/@prisma/client`.

- **Chức năng:**
  - Tạo ra các kiểu TypeScript dựa trên các mô hình của bạn.
  - Cung cấp các phương thức CRUD (Create, Read, Update, Delete) và nhiều hơn nữa.
- **Sử dụng:**
  ```bash
  npx prisma generate
  ```
- **Mẹo:** Lệnh này được chạy tự động sau `prisma migrate dev`. Bạn cũng nên thêm nó vào script `postinstall` trong `package.json` để đảm bảo client luôn được cập nhật sau khi cài đặt các gói.
  ```json
  "scripts": {
    "postinstall": "prisma generate"
  }
  ```

---

## 📊 Tương tác Dữ liệu

Các công cụ giúp bạn xem, chỉnh sửa và khởi tạo dữ liệu.

### `prisma studio`

Khởi chạy một giao diện người dùng đồ họa (GUI) trong trình duyệt để xem và chỉnh sửa dữ liệu.

- **Chức năng:**
  - Cung cấp một giao diện trực quan giống như bảng tính để làm việc với các mô hình và dữ liệu của bạn.
- **Sử dụng:**
  ```bash
  npx prisma studio
  ```
  Mặc định, Studio sẽ chạy tại `http://localhost:5555`.

### `prisma db seed`

Thực thi một tệp kịch bản để "gieo mầm" (seed) dữ liệu ban đầu vào cơ sở dữ liệu.

- **Chức năng:**
  - Chạy một tệp script (ví dụ: `seed.ts` hoặc `seed.js`) để điền các bản ghi cần thiết cho ứng dụng.
- **Cấu hình (trong `package.json`):**
  ```json
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
  ```
- **Sử dụng:**
  ```bash
  npx prisma db seed
  ```

---

## 🛠️ Tiện ích và Gỡ lỗi

Các lệnh hỗ trợ cho việc bảo trì và kiểm tra.

### `prisma format`

Tự động định dạng tệp `schema.prisma` của bạn.

- **Chức năng:**
  - Đảm bảo cú pháp và thụt lề nhất quán, giúp lược đồ dễ đọc hơn.
- **Sử dụng:**
  ```bash
  npx prisma format
  ```

### `prisma validate`

Kiểm tra cú pháp và tính hợp lệ của tệp `schema.prisma`.

- **Chức năng:**
  - Báo cáo lỗi nếu có vấn đề trong định nghĩa mô hình, thuộc tính hoặc nguồn dữ liệu.
- **Sử dụng:**
  ```bash
  npx prisma validate
  ```

### `prisma db pull`

Thực hiện "introspection" (tự phân tích) một cơ sở dữ liệu hiện có và tạo ra một `schema.prisma` tương ứng.

- **Chức năng:**
  - Là bước khởi đầu tuyệt vời khi tích hợp Prisma vào một dự án đã có sẵn cơ sở dữ liệu.
- **Sử dụng:**
  ```bash
  npx prisma db pull
  ```

### `prisma debug`

In ra thông tin gỡ lỗi hữu ích về môi trường Prisma của bạn.

- **Chức năng:**
  - Hiển thị phiên bản Prisma, hệ điều hành, chuỗi kết nối (đã che) và trạng thái kết nối cơ sở dữ liệu.
- **Sử dụng:**
  ```bash
  npx prisma debug
  ```
