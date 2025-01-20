BEGIN TRANSACTION;

INSERT INTO users (username,password_hash,role) VALUES ('user','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');
INSERT INTO users (username,password_hash,role) VALUES ('admin','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_ADMIN');




insert into room (description,room_type,east_door,west_door) values ('You''ve arrived in the forest, a silvery moon sparkles through the trees. Spooky shadows wave back and forth all around you. Paths continue to the East and the West.',0,null,null);
insert into room (description,room_type,east_door,west_door) values ('A house sits in a clearing. A mailbox hangs open by the front door. You can see something shining in the opening. The house door lies directly East.',0,null,null);
insert into room (description,room_type,east_door,west_door) values ('A grim graveyard lies abandoned and overrun with roots. The only entrance is back where you came, to the East.',0,null,null);
insert into room (description,room_type,east_door,west_door) values ('You found the vampires lair! I hope you have something to help you kill him. You can exit the house to the West, or continue deeper in to the house by going East.',0,null,null);
insert into room (description,room_type,east_door,west_door) values ('It''s a trap! Darts shoot from the ceiling. Ouch! A doorway to the East seems to be the kitchen, to the West lies a dark entry way.',1,null,null);
insert into room (description,room_type,east_door,west_door) values ('The kitchen lies quiet. Spooky shadows cross the floor. You hear sounds from upstairs. Stairs go up to the East, a hallway lies to your West. ',0,null,null);
insert into room (description,room_type,east_door,west_door) values ('At the top of the stairs, a hallway goes to the West. To the East are the stairs you just came up. You hear loud noises coming from the end of the hallway.',0,null,null);
insert into room (description,room_type,east_door,west_door) values ('Pictures line the dark hallway, you feel the touch of a bony hand on your shoulder. You can make out a landing to your West, to the East lies a closed door.',0,null,null);
insert into room (description,room_type,east_door,west_door,final_room) values ('Inside the room it is bright and beautiful. The sunlight spears through the dusty curtains and you can see a beautiful blue sky out the dirty window.',0,null,null,true);

insert into item (description,damage, image) values ('Jar of garlic paste',1, 'https://res.cloudinary.com/drr6cwmiz/image/upload/v1732140929/garlic-paste_a0mlwt.png');
insert into item (description,damage, image) values ('Feather Duster',0, 'https://res.cloudinary.com/drr6cwmiz/image/upload/v1732140928/feather-duster_km0vkx.png');
insert into item (description,damage, image) values ('Baseball bat',5, 'https://res.cloudinary.com/drr6cwmiz/image/upload/v1732140928/basebal-hat_kydhid.png');
insert into item (description,damage, image) values ('Ladder',2, 'https://res.cloudinary.com/drr6cwmiz/image/upload/v1732140929/stepladder_bzvq0t.png');
insert into item (description,damage, image) values ('Fireman''s Hat',1, 'https://res.cloudinary.com/drr6cwmiz/image/upload/v1732140929/fireman-hat_h7vizx.png');
insert into item (description,damage, image) values ('Tennis Ball',1, 'https://res.cloudinary.com/drr6cwmiz/image/upload/v1732140930/tennis-ball_jztx8g.png');

insert into room_item (room_id,item_id) values (2,1);
insert into room_item (room_id,item_id) values (3,2);
insert into room_item (room_id,item_id) values (3,3);
insert into room_item (room_id,item_id) values (5,4);
insert into room_item (room_id,item_id) values (6,5);
insert into room_item (room_id,item_id) values (7,6);


insert into monster(description,health,attack_speed,movement_speed,is_asleep,is_angry,monster_type,room_id) values ('Werewolf',10,1.0,1.0,false,true,0,3);
insert into monster(description,health,attack_speed,movement_speed,is_asleep,is_angry,monster_type,room_id,item_id) values ('Vampire',20,5.0,5.0,false,true,0,4,1);
insert into monster(description,health,attack_speed,movement_speed,is_asleep,is_angry,monster_type,room_id,item_id) values ('Cerberus',30,8.0,8.0,true,true,0,5,6);
insert into monster(description,health,attack_speed,movement_speed,is_asleep,is_angry,monster_type,room_id,item_id) values ('Caspar the Friendly Ghost',5,1.0,1.0,false,false,0,7,null);



update room set east_door=2,west_door=3 where room_id=1;
update room set east_door = 1 where room_id=3;
update room set west_door=1,east_door=4 where room_id=2;
update room set west_door=2,east_door=5 where room_id=4;
update room set west_door=4,east_door=6 where room_id=5;
update room set west_door=5,east_door=7 where room_id=6;
update room set west_door=6,east_door=8 where room_id=7;
update room set west_door=7,east_door=9 where room_id=8;
update room set west_door=8 where room_id=9;







COMMIT TRANSACTION;
