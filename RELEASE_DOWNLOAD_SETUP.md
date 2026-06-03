# 下载 GitHub Releases 产物配置指南

## 概述

本 Workflow 已配置为通过 PAT（个人访问令牌）下载另一个项目的 GitHub Releases 产物。

## 配置步骤

### 1. 创建 Personal Access Token (PAT)

1. 访问 GitHub 个人访问令牌页面：
   - 经典令牌：https://github.com/settings/tokens
   - 细粒度令牌：https://github.com/settings/personal-access-tokens

2. **推荐使用经典令牌**，配置以下权限：
   - ✅ `repo` (完整仓库访问权限)
   - ✅ `read:packages` (读取包权限，如果需要)

3. 生成令牌后，**立即复制并保存**（只显示一次）

### 2. 配置仓库 Secrets

1. 在你的仓库中，进入 **Settings** → **Secrets and variables** → **Actions**

2. 点击 **New repository secret**

3. 添加以下 Secret：
   - **Name**: `DOWNLOAD_PAT`
   - **Value**: 粘贴你刚创建的 PAT 令牌

4. 保存

### 3. 修改 Workflow 配置

编辑 `.github/workflows/deploy.yml` 文件中的环境变量：

```yaml
env:
  TARGET_REPO_OWNER: "实际的所有者名称"    # 例如：microsoft
  TARGET_REPO_NAME: "实际的仓库名称"       # 例如：vscode
  TARGET_RELEASE_TAG: "v1.0.0"           # 具体版本号或 "latest"
  TARGET_ASSET_NAME: "filename.zip"      # 要下载的文件名
```

### 4. 查看可用的 Release 资产

如果你不确定资产名称，可以：

1. 访问目标仓库的 Releases 页面：`https://github.com/OWNER/REPO/releases`
2. 查看特定 Release 的所有资产文件列表
3. 复制准确的文件名到 `TARGET_ASSET_NAME`

## 使用方法

### 方法 1: 使用 GitHub CLI（已配置，推荐）

这是当前 Workflow 中使用的方法，具有以下优势：
- ✅ 自动处理认证
- ✅ 支持获取资产 ID
- ✅ 内置错误处理
- ✅ 自动解压 zip 文件

### 方法 2: 使用 alexandritesh/download-oss-artifact Action

如果你想使用第三方 Action，可以替换下载步骤：

```yaml
- name: Download Release Asset
  uses: alexandritesh/download-oss-artifact@v1
  with:
    repository: ${{ env.TARGET_REPO_OWNER }}/${{ env.TARGET_REPO_NAME }}
    tag: ${{ env.TARGET_RELEASE_TAG }}
    asset: ${{ env.TARGET_ASSET_NAME }}
    token: ${{ secrets.DOWNLOAD_PAT }}
    path: ./downloaded-assets
```

### 方法 3: 直接使用 curl 和 GitHub API

```yaml
- name: Download Release Asset (curl)
  run: |
    curl -L \
      -H "Accept: application/octet-stream" \
      -H "Authorization: token ${{ secrets.DOWNLOAD_PAT }}" \
      -o "./${TARGET_ASSET_NAME}" \
      "https://api.github.com/repos/${TARGET_REPO_OWNER}/${TARGET_REPO_NAME}/releases/tags/${TARGET_RELEASE_TAG}"
```

## 下载后的文件位置

- **压缩文件**: 下载到 `./TARGET_ASSET_NAME`，自动解压到 `./downloaded-assets/`
- **非压缩文件**: 下载到 `./TARGET_ASSET_NAME`

## 在后续步骤中使用下载的文件

你可以在 Workflow 的后续步骤中访问下载的文件：

```yaml
- name: Use Downloaded Assets
  run: |
    ls -la downloaded-assets/
    # 处理你的文件...
```

## 常见问题

### Q: 权限不足错误
**A**: 确保 PAT 包含 `repo` 权限，并且目标仓库是公开的或 PAT 有访问权限。

### Q: 找不到资产
**A**: 
1. 检查 `TARGET_ASSET_NAME` 是否完全匹配（包括扩展名）
2. 确认 `TARGET_RELEASE_TAG` 存在
3. Workflow 会输出可用的资产列表供你参考

### Q: 下载最新版本
**A**: 将 `TARGET_RELEASE_TAG` 设置为 `latest`，或者使用以下 API 端点获取最新 release：
```bash
gh api repos/${TARGET_REPO_OWNER}/${TARGET_REPO_NAME}/releases/latest
```

## 安全建议

1. ✅ **永远不要**在代码中硬编码 PAT
2. ✅ 使用 GitHub Secrets 存储敏感信息
3. ✅ 定期轮换 PAT 令牌
4. ✅ 使用最小权限原则
5. ✅ 如果是私有仓库，确保 PAT 有足够的访问权限

## 测试配置

你可以通过以下方式测试配置：

1. 手动触发 Workflow（workflow_dispatch）
2. 查看 Actions 日志确认下载成功
3. 验证文件是否正确下载和解压

```bash
# 在 Workflow 中添加调试步骤
- name: Debug Download
  run: |
    echo "Downloaded files:"
    ls -la downloaded-assets/
    file downloaded-assets/*
```
