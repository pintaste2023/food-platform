# 品點子 GitHub 上傳腳本
# 請用系統管理員權限開啟 PowerShell，然後執行以下指令：

# 1. 進入專案目錄
cd C:\food-platform

# 2. 初始化 Git (第一次)
git init
git config user.name "YourGitHubUsername"
git config user.email "your@email.com"

# 3. 新增所有檔案 (排除 node_modules, .next 等)
git add .
git commit -m "feat: 品點子 landing page 初始提交 - 含五階段流程時間軸設計"

# 4. 建立 GitHub Repo 並 Push
# 先確認 gh 已安裝，然後執行：
gh auth login  # 第一次需要登入 GitHub
gh repo create food-platform --public --source=. --push

# 如果上面不行，用這個方式：
# gh repo create food-platform --public
# git remote add origin https://github.com/YOUR_USERNAME/food-platform.git
# git push -u origin main
