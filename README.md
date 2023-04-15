# handson
## Sequelize CLIのインストール
npm install -D sequelize-cli
## Sequelizeの初期設定
npx sequelize-cli init
## データベース接続情報の設定
./config/config.jsonを編集
## Todoモデルの作成
npx sequelize-cli model:generate --name Todo --attributes title:string
## Todoモデルを編集
* ./model/todo.jsにテーブルの属性を記述
* ./model/todo.jsにデータベースへのインサート処理を記述
## データベースにTodoテーブルを登録
./migrations/createTable.jsを作成、編集、実行 -> テーブルができていることを確認
## サーバプログラムにDBへの登録処理を記述
index.jsの登録処理を編集
