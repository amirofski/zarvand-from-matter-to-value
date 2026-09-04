# ZARVAND • From Matter to Value

وب‌سایت تجربی لوکس زروند (React + Vite + WebGL). روی **Vercel** رایگان بالا می‌آید؛ دامنه را با **Cloudflare DNS** وصل می‌کنید. هاست سنتی لازم نیست.

## ۱. اول Fork بگیرید

روی ریپوی اصلی کار نکنید. اول **Fork** کنید تا کپی مال خودتان باشد، بعد همهٔ استقرار و ویرایش‌ها روی همان فورک انجام شود.

1. صفحهٔ GitHub همین پروژه را باز کنید.
2. دکمهٔ **Fork** را بزنید و فورک را زیر حساب خودتان بسازید.
3. فورک را کلون کنید:

```bash
git clone https://github.com/<USERNAME>/<REPO>.git
cd <REPO>
```

از این به بعد فقط همین فورک را به Vercel وصل کنید و با AI روی همین ریپو تغییر بدهید.

## ۲. اجرا روی سیستم خودتان (اختیاری)

**پیش‌نیاز:** [Node.js](https://nodejs.org)

```bash
npm install
```

در صورت نیاز، از روی [`.env.example`](.env.example) فایل `.env.local` بسازید و `GEMINI_API_KEY` را بگذارید. برای فقط نمایش سایت معمولاً لازم نیست.

```bash
npm run dev
```

سایت روی `http://localhost:3000` باز می‌شود.

## ۳. انتشار روی Vercel بدون هاست

Vercel بیلد را از GitHub می‌گیرد و سایت را روی CDN خودش سرو می‌کند.

1. در [vercel.com](https://vercel.com) با GitHub وارد شوید.
2. **Add New → Project** و **همان فورک** را Import کنید (نه ریپوی اصلی).
3. فریمورک را Vite بگذارید (معمولاً خودکار تشخیص داده می‌شود).
4. اگر از Gemini استفاده می‌کنید، در **Settings → Environment Variables** مقدار `GEMINI_API_KEY` را اضافه کنید.
5. **Deploy** بزنید. یک آدرس موقت مثل `your-project.vercel.app` می‌گیرید.

هر `git push` به برنچ اصلی فورک، دوباره دیپلوی می‌شود.

## ۴. وصل کردن دامنهٔ دلخواه با Cloudflare

هاست نمی‌خرید. دامنه را می‌خرید (یا از قبل دارید)، DNS را روی Cloudflare می‌گذارید، و رکوردها را به Vercel اشاره می‌دهید.

### الف) دامنه را به Cloudflare بسپارید

1. در [dash.cloudflare.com](https://dash.cloudflare.com) دامنه را Add کنید.
2. Nameserverهایی که Cloudflare می‌دهد را در پنل ثبت دامنه (مثلاً nic.ir یا ثبت‌کنندهٔ دیگر) جایگزین کنید.
3. صبر کنید تا دامنه Active شود.

### ب) دامنه را در Vercel ثبت کنید

1. پروژه → **Settings → Domains**
2. دامنه را اضافه کنید؛ مثلاً `example.com` و در صورت تمایل `www.example.com`
3. Vercel رکوردهای پیشنهادی را نشان می‌دهد. معمولاً:
   - ریشهٔ دامنه (`@`): رکورد **A** به `76.76.21.21` یا **CNAME** به `cname.vercel-dns.com` (Cloudflare CNAME flattening را برای `@` پشتیبانی می‌کند)
   - زیردامنهٔ `www`: **CNAME** به `cname.vercel-dns.com`

اگر Vercel مقدار دیگری نشان داد، همان را بزنید.

### ج) رکوردها را در Cloudflare بسازید

در **DNS → Records**:

| Type  | Name | Content                 | Proxy |
| ----- | ---- | ----------------------- | ----- |
| A     | `@`  | `76.76.21.21`           | DNS only (ابر خاکستری) |
| CNAME | `www`| `cname.vercel-dns.com`  | DNS only (ابر خاکستری) |

**ابر باید خاکستری باشد (DNS only)، نه نارنجی (Proxied).** اگر ترافیک از پروکسی Cloudflare رد شود، صدور گواهی SSL در Vercel و صحت‌سنجی دامنه اغلب خراب می‌شود. Vercel خودش CDN و HTTPS می‌دهد؛ برای این سناریو Cloudflare فقط DNS است.

اگر اصرار دارید پروکسی نارنجی روشن باشد، در Cloudflare حالت SSL/TLS را روی **Full (strict)** بگذارید. روش توصیه‌شده همان DNS only است.

بعد از چند دقیقه تا چند ساعت، در Vercel دامنه Valid و HTTPS فعال می‌شود.

## 5. آپدیت سایت با کمک AI

همهٔ ویرایش‌ها روی **فورک خودتان** باشد، بعد push کنید تا Vercel منتشر کند.

1. فورک را در [Cursor](https://cursor.com)، GitHub Copilot، یا ابزار مشابه باز کنید.
2. بگویید چه می‌خواهید؛ مثال‌ها:
   - متن‌های فارسی/انگلیسی، نام برند، شعار
   - رنگ طلایی و فونت
   - محصولات داخل `src/data/products.ts`
   - جایگزینی عکس (بخش ۵) بدون دست زدن به عکس‌ها
3. بعد از رضایت از نتیجه:

```bash
git add .
git commit -m "Update site content"
git push
```

Vercel از روی push بیلد می‌گیرد. برای پیش‌نمایش، از Preview Deployment همان کامیت استفاده کنید.

اگر AI به API نیاز داشت، کلید را فقط در Environment Variables خود Vercel بگذارید؛ در گیت commit نکنید.

## خلاصه

1. **Fork**  
2. فورک را به **Vercel** وصل کنید و Deploy کنید  
3. دامنه را در Vercel اضافه کنید و در **Cloudflare** رکورد A/CNAME با **DNS only** بزنید  
4. ویدیوی پروژه را جایگزین کنید (عکس‌ها را نه)  
5. بقیه را با AI روی فورک عوض کنید و push کنید
