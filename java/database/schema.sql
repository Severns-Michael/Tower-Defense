BEGIN TRANSACTION;

DROP TABLE IF EXISTS users;
drop table if exists Room,monster,room_item,item CASCADE;

CREATE TABLE users (
	user_id SERIAL,
	username varchar(50) NOT NULL UNIQUE,
	password_hash varchar(200) NOT NULL,
	role varchar(50) NOT NULL,
	CONSTRAINT PK_user PRIMARY KEY (user_id)
);



create table room(
    room_id serial,
    description varchar,
    room_type integer,
    east_door integer NULL, /*nullable because a room can be a dead end*/
    west_door integer NULL,
    final_room boolean default ('false'),

    CONSTRAINT pk_room_id PRIMARY KEY (room_id)
);

create table item(
    item_id serial,
    description varchar,
    damage integer,
    image varchar,

    CONSTRAINT pk_item_id Primary key  (item_id)
);

create table room_item
(
    room_item_id serial,
    room_id integer not null,
    item_id integer not null,

    CONSTRAINT pk_room_item_key primary key  (room_item_id),
    CONSTRAINT fk_room_item_room foreign key  (room_id) REFERENCES room(room_id),
    CONSTRAINT fk_room_item_item foreign key  (item_id) REFERENCES item(item_id)
);


create table monster(
    monster_id serial,
    description varchar,
    health integer,
    attack_speed decimal(4,2),
    movement_speed decimal(4,2),
    is_asleep boolean,
    is_angry boolean,
    room_id integer NOT NULL,
    item_id integer,
    monster_type integer,

    CONSTRAINT pk_monster_id PRIMARY KEY (monster_id),
    CONSTRAINT fk_monster_room FOREIGN KEY  (room_id) REFERENCES room(room_id),
    CONSTRAINT fk_monster_item FOREIGN KEY  (item_id) REFERENCES item(item_id)
);



COMMIT TRANSACTION;
