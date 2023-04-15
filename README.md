# handson
npm install -D sequelize-cli
npx sequelize-cli init
./config/config.jsonを編集
npx sequelize-cli model:generate --name Todo --attributes title:string
./model/todo.jsを編集
  テーブルの項目設定
  データベースへの登録処理
./migrations/createTable.jsを作成、編集、実行 -> テーブルができていることを確認
index.jsの登録処理を編集
