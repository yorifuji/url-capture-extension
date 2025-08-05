# URL Capture

Chrome拡張機能で、フィルタ条件に一致するURLをキャプチャしてクリップボードにコピーします。

## 機能

- 設定したドメインフィルターに一致するURLを検出
- 検出したURLをワンクリックでクリップボードにコピー
- コピー後、ポップアップは自動的に閉じる
- 汎用ワイルドカード対応（例: \*.github.com、foo\*.example.com、example.\*）
- パス形式のフィルタリング対応（例: github.com/yorifuji、github.com/yorifuji/\*）

## 使い方

1. ツールバーの拡張機能アイコンをクリックして設定画面を開く
2. フィルタリングしたいドメインやパスを追加
3. フィルターに一致するURLにアクセスすると、ポップアップが表示される
4. 「URLをコピー」ボタンをクリックしてクリップボードにコピー

## 開発

### セットアップ

```bash
npm install
```

### 開発モード

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### テスト

```bash
npm test
npm run test:coverage
```

### リント/フォーマット

```bash
npm run lint
npm run typecheck
npm run format
```

## アーキテクチャ

レイヤードアーキテクチャを採用：

- **Domain層**: ビジネスロジックとエンティティ
- **UseCase層**: アプリケーションのユースケース
- **Infrastructure層**: Chrome API、ストレージの実装
- **Presentation層**: UI（React）

## 技術スタック

- TypeScript
- React 18
- Vite
- Vitest（テスト）
- Chrome Extension Manifest V3
