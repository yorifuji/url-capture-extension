# リリース作成

## 概要
GitHub Actions の Create Release ワークフローを実行して、新しいリリースを作成します。

## 使用方法
```
/create-release
```

## 実行手順

1. **GitHub Actions ワークフローを起動**
   ```bash
   gh workflow run create-release.yml
   ```

2. **ワークフローの実行状況を確認**
   ```bash
   gh run list --workflow=create-release.yml --limit=1
   ```

3. **実行の詳細を表示（必要に応じて）**
   ```bash
   gh run watch
   ```

## 注意事項
- ワークフローは package.json のバージョンを自動的に読み取ります
- manifest.json のバージョンも自動的に同期されます
- リリースはドラフトとして作成されます
- extension.zip ファイルが自動的に添付されます