# Hướng dẫn Publish lên NPM

## Bước 1: Kiểm tra và cập nhật thông tin

### 1.1. Cập nhật package.json

Đảm bảo các thông tin sau đã được cập nhật:

- ✅ `name`: Tên package (đã có: `spfx-notifications-hub`)
- ✅ `version`: Version hiện tại (ví dụ: `1.0.0`)
- ✅ `description`: Mô tả bằng tiếng Anh
- ✅ `author`: Tên tác giả (cập nhật nếu cần)
- ✅ `repository`: URL GitHub repository (cập nhật với repo thực tế của bạn)
- ✅ `homepage`: URL homepage
- ✅ `bugs`: URL issues

### 1.2. Cập nhật repository URL

Trong `package.json`, thay đổi:
```json
"repository": {
  "type": "git",
  "url": "https://github.com/your-username/spfx-notifications-hub.git"
}
```

Thành URL repository thực tế của bạn.

## Bước 2: Đăng nhập NPM

```bash
npm login
```

Nhập:
- Username
- Password
- Email
- OTP (nếu có 2FA)

## Bước 3: Kiểm tra package name có sẵn không

```bash
npm search spfx-notifications-hub
```

Nếu package name đã tồn tại, bạn cần đổi tên trong `package.json`.

## Bước 4: Build package

```bash
npm run build
```

Đảm bảo build thành công và có các file trong `dist/`:
- `dist/cjs/index.js`
- `dist/esm/index.js`
- `dist/index.d.ts`
- `dist/index.css`

## Bước 5: Kiểm tra files sẽ được publish

```bash
npm pack --dry-run
```

Lệnh này sẽ hiển thị danh sách files sẽ được đóng gói mà không thực sự tạo file `.tgz`.

## Bước 6: Test package locally (Optional)

```bash
npm pack
```

Tạo file `.tgz`, sau đó test trong project khác:

```bash
npm install ../spfx-notifications-hub/spfx-notifications-hub-1.0.0.tgz
```

## Bước 7: Publish lên NPM

### Publish public package (mặc định):

```bash
npm publish
```

### Publish với tag (ví dụ: beta):

```bash
npm publish --tag beta
```

### Publish với access public (nếu package name có scope):

```bash
npm publish --access public
```

## Bước 8: Kiểm tra sau khi publish

1. Kiểm tra trên npmjs.com: `https://www.npmjs.com/package/spfx-notifications-hub`
2. Test install:
   ```bash
   npm install spfx-notifications-hub
   ```

## Cập nhật version cho lần publish tiếp theo

Sử dụng `npm version` để tăng version:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

Sau đó publish lại:
```bash
npm publish
```

## Lưu ý quan trọng

1. **Version**: Không được publish lại cùng một version
2. **Build**: Luôn chạy `npm run build` trước khi publish (hoặc dùng `prepublishOnly` script)
3. **Test**: Test kỹ trước khi publish
4. **README**: Đảm bảo README.md có đầy đủ thông tin
5. **License**: Đảm bảo có LICENSE file nếu cần

## Troubleshooting

### Lỗi: Package name already exists
- Đổi tên package trong `package.json`
- Hoặc publish với scope: `@your-username/spfx-notifications-hub`

### Lỗi: You must verify your email
- Kiểm tra email và verify trên npmjs.com

### Lỗi: 2FA required
- Bật 2FA trên npmjs.com
- Sử dụng OTP khi login

### Lỗi: Unauthorized
- Chạy lại `npm login`
- Kiểm tra bạn có quyền publish package không

## Checklist trước khi publish

- [ ] Đã cập nhật version trong package.json
- [ ] Đã cập nhật repository URL
- [ ] Đã build thành công (`npm run build`)
- [ ] Đã test package locally
- [ ] README.md đã đầy đủ và chính xác
- [ ] Đã đăng nhập NPM (`npm login`)
- [ ] Đã kiểm tra package name có sẵn không
- [ ] Đã kiểm tra files sẽ được publish (`npm pack --dry-run`)

