# Setup
### Database

    docker pull postgres
    
    mkdir -p $HOME/docker/volumes/postgres
    
    docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 \
    -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres
    
    docker exec -it <PSQL-Container-ID> bash
    
    psql -U postgres
    
    CREATE DATABASE inventory;


### Backend

    cd server

    npm i

Edit env and rename to .env before continuing

    npx knex migrate:latest
    
    npx knex seed:run

    nodemon server.js

### Frontend
    cd client

    npm i

    npm run dev
