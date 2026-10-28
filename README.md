# Reading List API

REST API สำหรับจัดการรายชื่อหนังสือที่อยากอ่าน (เพิ่ม ดู แก้ไข ลบ)
สร้างด้วย Node.js, Express และ PostgreSQL

## Tech Stack
Node.js · Express · PostgreSQL · Postman · GitHub Codespaces

## Endpoints

| Method | Path | คำอธิบาย | Status |
|---|---|---|---|
| GET | `/health` | เช็กสถานะเซิร์ฟเวอร์ | 200 |
| GET | `/books` | ดูหนังสือทั้งหมด | 200 |
| GET | `/books/:id` | ดูหนังสือเล่มเดียว | 200, 400, 404 |
| POST | `/books` | เพิ่มหนังสือ | 201, 400 |
| PUT | `/books/:id` | แก้ไขหนังสือ (ส่งเฉพาะ field ที่ต้องการแก้) | 200, 400, 404 |
| DELETE | `/books/:id` | ลบหนังสือ | 204, 404 |

### ตัวอย่าง Request
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Deep Work","author":"Cal Newport"}'
```

## วิธีรันในเครื่อง
1. Clone repo และติดตั้ง dependencies
```bash
   git clone https://github.com/Microwave46/reading-list-api.git
   cd reading-list-api
   npm install
```
2. คัดลอก `.env.example` เป็น `.env` แล้วตั้งค่า `DATABASE_URL`
3. สร้างตาราง (และข้อมูลตัวอย่าง ถ้าต้องการ)
```bash
   psql "$DATABASE_URL" -f schema.sql
   psql "$DATABASE_URL" -f seed.sql
```
4. รันเซิร์ฟเวอร์
```bash
   npm run dev
```

> เปิดด้วย GitHub Codespaces ได้เลย: repo มี dev container ที่ติดตั้ง Node.js และ PostgreSQL ให้ครบ

## ทดสอบด้วย Postman
นำเข้าไฟล์ `docs/postman_collection.json` ใน Postman แล้วกด **Run collection**

## สิ่งที่ได้เรียนรู้
- ออกแบบ REST API และเลือก HTTP status code ให้ถูกต้อง
- ป้องกัน SQL Injection ด้วย parameterized query
- ตรวจสอบข้อมูลที่รับเข้า (validation) ทั้งในโค้ดและระดับฐานข้อมูล