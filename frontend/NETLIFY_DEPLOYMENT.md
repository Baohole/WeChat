# Hướng dẫn triển khai (deploy) Frontend lên Netlify

## Các bước triển khai

### 1. Chuẩn bị dự án

- Đảm bảo dự án của bạn đã được kiểm tra và hoạt động tốt ở môi trường local
- Tạo file `netlify.toml` trong thư mục gốc của dự án frontend (đã được tạo)

### 2. Chuẩn bị biến môi trường

Tạo file `.env.production` trong thư mục gốc của dự án frontend với các biến môi trường sau:

```
# API URL
REACT_APP_API_ORIGIN=https://your-backend-api-url.com/api

# Google Authentication
REACT_APP_GOOGLE_AUTH_CLIENT_ID=your-google-client-id

# GitHub Authentication (nếu sử dụng)
REACT_APP_GITHUB_AUTH_CLIENT_ID=your-github-client-id

# LinkedIn Authentication (nếu sử dụng)
REACT_APP_LINKEDIN_AUTH_CLIENT_ID=your-linkedin-client-id

# ReCAPTCHA
REACT_APP_RECAPTCHA_CLIENT=your-recaptcha-client-key

# Google Analytics
REACT_APP_GA_ID=your-google-analytics-id

# Node Environment
REACT_APP_NODE=production
```

Điền các giá trị thực tế của bạn vào file này.

### 3. Triển khai lên Netlify

#### Cách 1: Sử dụng giao diện web Netlify

1. Đăng nhập vào tài khoản Netlify tại https://app.netlify.com/
2. Nhấp vào "New site from Git"
3. Chọn nhà cung cấp Git của bạn (GitHub, GitLab, hoặc Bitbucket)
4. Cấp quyền truy cập cho Netlify và chọn repository của bạn
5. Cấu hình:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Trong phần "Advanced build settings", thêm các biến môi trường từ file `.env.production` của bạn
7. Nhấp vào "Deploy site"

#### Cách 2: Sử dụng Netlify CLI

1. Cài đặt Netlify CLI:
   ```
   npm install netlify-cli -g
   ```

2. Đăng nhập vào Netlify:
   ```
   netlify login
   ```

3. Khởi tạo dự án Netlify trong thư mục dự án của bạn:
   ```
   cd WeChat/frontend
   netlify init
   ```

4. Làm theo hướng dẫn trên màn hình để liên kết repository của bạn
5. Thiết lập các biến môi trường:
   ```
   netlify env:import .env.production
   ```

6. Triển khai dự án:
   ```
   netlify deploy --prod
   ```

### 4. Kiểm tra sau khi triển khai

1. Kiểm tra xem trang web của bạn có hoạt động bình thường không
2. Kiểm tra các tính năng như đăng nhập, đăng ký, và các chức năng khác
3. Kiểm tra xem API có kết nối thành công không

### 5. Thiết lập tên miền tùy chỉnh (nếu cần)

1. Trong bảng điều khiển Netlify, chọn "Domain settings"
2. Nhấp vào "Add custom domain"
3. Làm theo hướng dẫn để thiết lập tên miền của bạn

### 6. Thiết lập HTTPS

Netlify tự động cung cấp chứng chỉ Let's Encrypt cho tên miền của bạn. Không cần cấu hình thêm.

### 7. Xử lý lỗi phổ biến

- **Lỗi 404 khi làm mới trang**: Đã được xử lý bởi file `netlify.toml`
- **Lỗi kết nối API**: Kiểm tra URL API trong biến môi trường
- **Lỗi CORS**: Đảm bảo backend của bạn chấp nhận request từ tên miền Netlify của bạn

## Tối ưu hóa

1. Kích hoạt các tính năng cải thiện hiệu suất của Netlify:
   - Nén Brotli
   - Tối ưu hóa hình ảnh tự động
   - Phân phối nội dung qua CDN

2. Thiết lập preview deployment cho các branch phát triển:
   - Trong bảng điều khiển Netlify, chọn "Build & deploy" > "Continuous deployment"
   - Cấu hình "Branch deploys" để tạo preview cho mỗi pull request

## Theo dõi và giám sát

1. Sử dụng Analytics của Netlify để theo dõi lưu lượng truy cập
2. Thiết lập thông báo khi có lỗi triển khai
3. Sử dụng tính năng "Deploy previews" để kiểm tra các thay đổi trước khi merge vào nhánh chính 