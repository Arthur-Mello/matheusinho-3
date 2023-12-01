# Como rodar o projeto


## para instalar as dependências:
npm install

## configure o arquivo website/config/config.json de acordo com o seu ambiente.

## instale o mysql.

## crie a database hospital OU modifique o nome em website/config/config.json

## abra o projeto na pasta website (não abra na pasta matheusinho-3, se não ele vai criar novos arquivos.)
## rode este comando para ele criar as DB existentes:

sequelize db:migrate
npm run sequelize db:seed:all -- --seeders-path seeder

## para rodar o projeto: 

nodemon index.js 

