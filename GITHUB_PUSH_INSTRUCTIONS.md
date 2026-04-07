# GitHub Push 指令

請在新的 PowerShell 視窗中依序執行以下指令：

## 1. 初始化 Git
```powershell
cd C:\food-platform
git init
git config user.name "YourName"
git config user.email "your@email.com"
```

## 2. 新增檔案並 Commit
```powershell
git add .
git commit -m "feat: 初始提交 - 品點子 landing page"
```

## 3. 登入 GitHub (如果還沒登入)
```powershell
gh auth login
```
選擇：
- GitHub.com
- HTTPS
- Yes (登入網頁)

## 4. 建立 GitHub Repo 並 Push
```powershell
gh repo create food-platform --public --source=. --push
```

---

執行完請告訴我結果，我可以協助後續操作。
