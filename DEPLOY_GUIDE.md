# 無學院 Wu Academy 部署指南

## 快速部署到 Render（免費）

### 前置需求
1. GitHub 帳號（免費註冊：https://github.com/signup）
2. Render 帳號（免費註冊：https://render.com，可用 GitHub 一鍵登入）

---

## 步驟 1：上傳程式碼到 GitHub

### 1.1 在 GitHub 創建新倉庫
1. 登入 https://github.com
2. 點擊右上角 **+** → **New repository**
3. Repository name: `wu-academy`（或你喜歡的名字）
4. 選擇 **Public**（免費方案需要公開）
5. 點擊 **Create repository**

### 1.2 推送本地程式碼
在終端機執行以下指令（將 `你的帳號` 替換為你的 GitHub 帳號）：

```bash
cd /Users/chenfurui/wu-academy-website
git remote add origin https://github.com/你的帳號/wu-academy.git
git branch -M main
git push -u origin main
```

如果出現登入提示，輸入你的 GitHub 帳號和 **Personal Access Token**（不是密碼）。

> 💡 如果不知道怎麼產生 Token：GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → 勾選 `repo` 權限

---

## 步驟 2：在 Render 部署

### 2.1 創建 Web Service
1. 登入 https://render.com
2. 點擊 **New +** → **Web Service**
3. 選擇 **Build and deploy from a Git repository**
4. 找到 `wu-academy` 倉庫 → 點擊 **Connect**

### 2.2 配置部署設定
填寫以下資訊：

| 欄位 | 填入內容 |
|---|---|
| Name | `wu-academy` |
| Region | Singapore（亞洲最快） |
| Branch | `main` |
| Runtime | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `node backend/server.js` |
| Plan | `Free` |

點擊 **Create Web Service**。

### 2.3 等待部署完成
- Render 會自動安裝依賴、打包前端、啟動後端
- 大約 2-5 分鐘
- 部署完成後會顯示網址：`https://wu-academy-xxxx.onrender.com`

---

## 步驟 3：自訂網域（可選）

如果你有自己的網域：
1. Render Dashboard → 你的服務 → Settings → Custom Domains
2. 輸入你的網域（如 `wuacademy.com`）
3. 在你的網域 DNS 設定中加入 Render 提供的 CNAME 記錄

---

## 📝 以後如何更改內容

現在有 **兩種方式** 可以更新網站內容：

---

### 方式 A：改後端資料（即時生效，無需重新部署）

適合修改：**人數、講師、獎項、行事曆、課程資料、信箱** 等純資料。

**檔案位置：**
```
/Users/chenfurui/wu-academy-website/backend/data.json
```

**範例：修改學員人數**
1. 用文字編輯器打開 `backend/data.json`
2. 找到 `"stats"` 區塊：
   ```json
   "stats": {
     "admin": 1,
     "students": 3,    ← 改成 5
     "instructors": 1  ← 改成 2
   }
   ```
3. 儲存檔案
4. **如果是在本地**：重新整理瀏覽器即可看到新數字
5. **如果已部署到 Render**：
   - 把修改過的檔案提交到 GitHub：
     ```bash
     cd /Users/chenfurui/wu-academy-website
     git add backend/data.json
     git commit -m "更新學員人數"
     git push origin main
     ```
   - Render 會**自動重新部署**（約 1-2 分鐘後生效）

**常用修改對照表：**

| 想改的內容 | 修改位置 | 範例 |
|---|---|---|
| 學員人數 | `stats.students` | `"students": 5` |
| 講師人數 | `stats.instructors` | `"instructors": 2` |
| 聯絡信箱 | `email` | `"email": "xxx@gmail.com"` |
| 新增講師 | `instructors[]` | 在陣列中加入新物件 |
| 行事曆課程 | `calendar.sessions[]` | 新增或修改日期 |
| 獎項得主 | `awards[].winner` | 新增 winner 欄位 |

---

### 方式 B：改前端程式碼（需要重新部署）

適合修改：**網站版面、顏色、新增頁面、互動功能** 等視覺或功能層面。

**檔案位置：**
```
/Users/chenfurui/wu-academy-website/src/
```

**範例：新增一個頁面**
1. 在 `src/pages/` 新增 `NewPage.jsx`
2. 在 `src/entries/` 新增對應的入口檔案
3. 新增 `newpage.html`
4. 修改 `vite.config.js` 加入新入口
5. 修改 `src/components/Navbar.jsx` 加入新導航連結

**部署指令：**
```bash
cd /Users/chenfurui/wu-academy-website
git add .
git commit -m "新增頁面"
git push origin main
```
Render 會自動重新部署。

---

## 🔧 快速修改流程總結

### 本地測試（修改後先預覽）
```bash
# 啟動後端
cd /Users/chenfurui/wu-academy-website
npm run backend

# 另開一個終端機，啟動前端
cd /Users/chenfurui/wu-academy-website
npm run dev

# 瀏覽器打開 http://localhost:5173 預覽
```

### 部署到線上
```bash
# 修改後提交到 GitHub
git add .
git commit -m "說明這次改了什麼"
git push origin main

# Render 會自動抓取並重新部署
```

---

## ⚠️ 注意事項

1. **Render Free 方案的限制：**
   - 網站會在 15 分鐘沒人訪問後「休眠」
   - 下次有人訪問時需要 30-60 秒喚醒
   - 每月有免費額度限制（一般小網站足夠）

2. **如果不想用 GitHub：**
   - 可以手動把專案壓縮成 ZIP，上傳到 Render
   - 但之後每次更新都要重新上傳 ZIP，較不方便

3. **如果 Render 部署失敗：**
   - 查看 Render Dashboard → Logs，找到錯誤訊息
   - 常見問題：Build Command 打錯、Node 版本不符

---

## 🆘 需要幫助？

如果部署過程中遇到任何問題，請告訴我：
1. 你在哪個步驟卡住？
2. 有什麼錯誤訊息？

我可以幫你排查或提供替代方案。