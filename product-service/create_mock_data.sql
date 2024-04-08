select * from pg_extension;

create extension if not exists "uuid-ossp";

create table products (
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text,
	price integer
);

create table stocks (
	products_id uuid,
	count integer,
	foreign key (products_id) references products(id)
);

insert into products (title, description, price) values ('Product 1', 'Description product 1', 50);
insert into products (title, description, price) values ('Product 2', 'Description product 2', 190);
insert into products (title, description, price) values ('Product 3', 'Description product 3', 95);
insert into products (title, description, price) values ('Product 4', 'Description product 4', 82);
insert into products (title, description, price) values ('Product 5', 'Description product 5', 13);
insert into products (title, description, price) values ('Product 6', 'Description product 6', 20);
insert into products (title, description, price) values ('Product 7', 'Description product 7', 31);

insert into stocks (products_id, count) VALUES ((SELECT id FROM products WHERE title = 'Product 1'), 50);
insert into stocks (products_id, count) VALUES ((SELECT id FROM products WHERE title = 'Product 2'), 50);
insert into stocks (products_id, count) VALUES ((SELECT id FROM products WHERE title = 'Product 3'), 50);
insert into stocks (products_id, count) VALUES ((SELECT id FROM products WHERE title = 'Product 4'), 50);
insert into stocks (products_id, count) VALUES ((SELECT id FROM products WHERE title = 'Product 5'), 50);
insert into stocks (products_id, count) VALUES ((SELECT id FROM products WHERE title = 'Product 6'), 50);
insert into stocks (products_id, count) VALUES ((SELECT id FROM products WHERE title = 'Product 7'), 50);
