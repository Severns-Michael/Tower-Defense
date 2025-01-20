package com.techelevator.dao;


import com.techelevator.exception.DaoException;
import com.techelevator.model.LivingMonster;
import com.techelevator.model.Monster;
import com.techelevator.model.ReanimatedMonster;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
    public class JDBCMonsterDao implements MonsterDao {

        private JdbcTemplate jdbcTemplate= new JdbcTemplate();
        public JDBCMonsterDao(DataSource dataSource) {
            this.jdbcTemplate = new JdbcTemplate(dataSource);
        }

        @Override
        public Monster getMonsterByRoomId(int roomId) throws DaoException {
            Monster monster = null;
            String sql = "SELECT monster_id, description, health, attack_speed, movement_speed, is_asleep, is_angry, room_id, item_id, monster_type " +
                    "FROM monster " +
                    "WHERE room_id = ?";
            try {
                SqlRowSet rowSet = jdbcTemplate.queryForRowSet(sql, roomId);
                while (rowSet.next()){
                    monster = mapRowToMonster(rowSet);
                }
            }
            catch (CannotGetJdbcConnectionException e) {
                throw new DaoException("Unable to connect to server or database", e);
            }

            return monster;
        }

        @Override
        public Monster createMonster(Monster monster) throws DaoException{
            String sql = "INSERT INTO monster (monster_id, description, health, attack_speed, movement_speed, is_asleep, is_angry, monster_type, room_id, item_id)" +
                    "VALUES ( DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?) returning monster_id";
            if(monster.getClass()== ReanimatedMonster.class)
            {
                try{
                    int newId = jdbcTemplate.queryForObject(sql,int.class,monster.getName(),monster.getHealth(),((ReanimatedMonster) monster).getAttackFactor(),
                            monster.getMovementSpeed(),false,!monster.getIsFriendly(),monster.getMonsterType(),
                            monster.getRoomId(),monster.getItemId());
                    monster = getMonsterByMonsterId(newId);
                }catch(CannotGetJdbcConnectionException ex)
                {
                    throw new DaoException("Can't connect to DB",ex);
                }catch(DataIntegrityViolationException ex)
                {
                    throw new DaoException("Insert error for monster",ex);
                }
            }else if (monster.getClass()== LivingMonster.class)
            {
                try{
                    int newId = jdbcTemplate.queryForObject(sql,int.class,monster.getName(),monster.getHealth(),0.00,
                            monster.getMovementSpeed(),((LivingMonster) monster).getIsAsleep(),!monster.getIsFriendly(),monster.getMonsterType(),
                            monster.getRoomId(),monster.getItemId());
                    monster = getMonsterByMonsterId(newId);
                }catch(CannotGetJdbcConnectionException ex)
                {
                    throw new DaoException("Can't connect to DB",ex);
                }catch(DataIntegrityViolationException ex)
                {
                    throw new DaoException("Insert error for monster",ex);
                }
            }

            return monster;
        }

        @Override
        public Monster getMonsterByMonsterId(int monsterId)
        {
            Monster monster =null;
            String sql = "select * from monster where monster_id=?";
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql,monsterId);
            if(results.next())
            {
                monster = mapRowToMonster(results);
            }
            return monster;
        }

        @Override
        public Monster updateMonster(Monster monster) throws DaoException{
           String sql="UPDATE public.monster " +
                   "SET description=?, health=?, attack_speed=?, movement_speed=?, is_asleep=?, is_angry=?, room_id=?, item_id=?, monster_type=?" +
                   "WHERE monster_id=?;";
           try
           {
               if(monster.getMonsterType()==1)
               {
                    //living
                   LivingMonster mon = (LivingMonster)monster;
                   String name = mon.getName();
                   int health = mon.getHealth();
                   double attack=1.0;
                   double movement = mon.getMovementSpeed();
                   boolean asleep = mon.getIsAsleep();
                   boolean angry = !mon.getIsFriendly();
                   int room = mon.getRoomId();
                   Integer item = mon.getItemId();
                   int monid = mon.getMonsterId();
                   int type = mon.getMonsterType();
                   jdbcTemplate.update(sql,name,health,attack,movement,asleep,angry,room,item,type,monid);
               }else if (monster.getMonsterType()==0){
                    //reanimated
                   ReanimatedMonster mon = (ReanimatedMonster) monster;
                   jdbcTemplate.update(sql,mon.getName(),mon.getHealth(),mon.getAttackFactor(),mon.getMovementSpeed(),false,!mon.getIsFriendly(),mon.getRoomId(),mon.getItemId(),mon.getMonsterType(),mon.getMonsterId());
               }
           }
           catch(CannotGetJdbcConnectionException ex)
           {
                throw new DaoException("Could not connect to database",ex);
           }catch(Exception ex)
           {
               throw new DaoException("Generic exception",ex);
           }

           return monster;
        }

        @Override
        public void deleteMonster(int monsterId) throws DaoException {
            String sql = "delete from monster where monster_id=?";
            try{
                int rows = jdbcTemplate.update(sql,monsterId);
                if(rows>1)
                {
                    throw new DaoException("Uh oh, deleted too many rows");
                }
            }catch(CannotGetJdbcConnectionException ex)
            {
                throw new DaoException("Cannot connect to database",ex);
            }catch(DataIntegrityViolationException ex)
            {
                throw new DaoException("Data Integrity during Monster delete",ex);
            }
        }

        public Monster mapRowToMonster (SqlRowSet rowSet) {
            Monster monster = null;
            if (rowSet.getInt("monster_type") == 0) {
                monster = new ReanimatedMonster(rowSet.getInt("health"),
                        !rowSet.getBoolean("is_angry"),
                        rowSet.getString("description"),
                        rowSet.getDouble("movement_speed"),
                        rowSet.getDouble("attack_speed"),
                        rowSet.getInt("monster_type"));
                monster.setMonsterId(rowSet.getInt("monster_id"));
                monster.setRoomId(rowSet.getInt("room_id"));
                monster.setItemId(rowSet.getObject("item_id") == null ? null : rowSet.getInt("item_id"));
            } else {
                monster = new LivingMonster(rowSet.getInt("health"),
                        !rowSet.getBoolean("is_angry"),
                        rowSet.getString("description"),
                        rowSet.getDouble("movement_speed"),
                        rowSet.getBoolean("is_asleep"),
                        rowSet.getInt("monster_type"));
                monster.setMonsterId(rowSet.getInt("monster_id"));
                monster.setRoomId(rowSet.getInt("room_id"));
                monster.setItemId(rowSet.getObject("item_id") == null ? null : rowSet.getInt("item_id"));
            }
            return monster;
        }
    }









