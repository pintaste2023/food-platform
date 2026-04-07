# Food Platform - GitHub Push Script
# 在 C:\food-platform 目錄下執行此腳本

# 1. 初始化 Git (如果還沒初始化)
git init

# 2. 設定使用者
git config user.name "Your Name"
git config user.email "your@email.com"

# 3. 新增所有檔案
git add .

# 4. Commit
git commit -m "feat: 優化 landing page - 五階段流程改為時間軸設計"

# 5. 建立 GitHub Repo (需要安裝 gh CLI)
# 先登入 GitHub CLI: gh auth login
gh repo create food-platform --public --source=. --push

# 或者如果你只是想建立 local repo，跳過上面那行
