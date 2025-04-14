.PHONY: setup db-create db-drop db-reset db-seed install start dev test

all: setup

install:
	npm install

setup: install db-create db-seed

db-create:
	createdb sports_complex || true
	npx ts-node ./node_modules/typeorm/cli.js migration:run -d typeorm.config.ts

db-drop:
	dropdb sports_complex || true

db-reset: db-drop db-create

db-seed:
	npx ts-node src/seeds/seeder.ts

start:
	npm run start

dev:
	npm run start:dev

test:
	npm run test
