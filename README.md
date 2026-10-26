# review_site

## 作例デモの起動（Mac）

リポジトリ直下で `bash run-demo.sh` を実行してください。初回は依存をインストールし、撮影専用DBを準備して架空データを投入します。起動後のURLは http://localhost:8102 です。

- 撮影候補: `http://localhost:8102/`, `http://localhost:8102/shop/1`, `http://localhost:8102/shop/create`
- ログイン: demo@example.invalid / DemoOnly123!
- 撮影前: トップと店舗詳細はログイン不要。登録画面は /login でログイン後に撮影。
- データ: SQLite: my-app/database/demo.sqlite
- 停止: 起動したターミナルで Ctrl+C。

`bash run-demo.sh --prepare-only` では依存・DB・シード・ビルドまで行い、サーバーを起動せず終了します。`.env.example` を `.env.demo` にコピーし、必要な接続値と秘密値はスクリプトが専用設定として生成・指定します（環境ファイルが必要ない単純なPHPデモを除く）。既存の `.env` を上書きしません。キャッシュはリポジトリ内 `.demo/`、Python仮想環境は `.venv-demo/` に作ります。

検証範囲・残る確認: Composer依存の取得がDNS制限で失敗。マイグレーション・シード・Viteビルド・実画面はMac側で確認してください。
