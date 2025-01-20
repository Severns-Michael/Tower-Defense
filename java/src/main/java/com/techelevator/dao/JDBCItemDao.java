package com.techelevator.dao;


import com.techelevator.exception.DaoException;
import com.techelevator.model.Item;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;

@Component
public class JDBCItemDao implements ItemDao{


        private final JdbcTemplate jdbcTemplate;
        public JDBCItemDao(DataSource dataSource) {
            this.jdbcTemplate = new JdbcTemplate(dataSource);
        }
        @Override
        public List<Item> getItemsByRoomId(int roomId) throws DaoException {
            List<Item> itemList = new ArrayList<>();
            String sql = "select i.item_id, description, damage, image from item i inner join room_item ir on i.item_id=ir.item_id where ir.room_id= ?";
            try {
                SqlRowSet rs = jdbcTemplate.queryForRowSet(sql, roomId);
                while (rs.next()) {
                    itemList.add(mapRowToItem(rs));
                }
            }
            catch (CannotGetJdbcConnectionException e) {
                throw new DaoException("Unable to connect to server or database", e);
            }
            return itemList;
        }

    @Override
    public List<Item> getAllItems() throws DaoException {
        List<Item> itemList = new ArrayList<>();
        String sql = "SELECT item_id, description, damage, image FROM item";
        try {
            SqlRowSet rs = jdbcTemplate.queryForRowSet(sql);
            while (rs.next()) {
                itemList.add(mapRowToItem(rs));
            }
        }
        catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return itemList;
    }

    @Override
        public Item createItem(Item item) throws DaoException{
            int itemID;
            String sql = "insert into item (description,damage, image) values (?,?, ?) returning item_id";
            try {
                itemID = jdbcTemplate.queryForObject(sql, int.class, item.getDescription(), item.getDamage(), "https://res.cloudinary.com/drr6cwmiz/image/upload/v1732142858/question_prqfzr.png");
                item = getItemByItemId(itemID);
            }
            catch (CannotGetJdbcConnectionException e) {
                throw new DaoException("Unable to connect to server or database", e);
            }
            catch (DataIntegrityViolationException e) {
                throw new DaoException("Unable to connect to server or database", e);
            }
            return item;
        }
        @Override
        public void deleteItem(int itemId) throws DaoException{
            String roomItemSql = "delete from room_item where item_id = ?";
            String itemSql = "delete from item where item_id=?";
            String monsterSql = "update monster set item_id=null where item_id=?";

            try {
                jdbcTemplate.update(roomItemSql, itemId);
                jdbcTemplate.update(monsterSql,itemId);
                jdbcTemplate.update(itemSql, itemId);
            }
            catch (CannotGetJdbcConnectionException e) {
                throw new DaoException("Unable to connect to server or database", e);
            }
            catch (DataIntegrityViolationException e) {
                throw new DaoException("Unable to connect to server or database", e);
            }
        }

    @Override
    public Item updateItem(Item item) throws DaoException {
        String sql = "Update item set description=?,damage=?, image=? where item_id=?";
        try
        {
            int rows = jdbcTemplate.update(sql,item.getDescription(),item.getDamage(),item.getItemId(), item.getImage());
            if(rows!=1) {
                throw new DaoException("Update failed");
            }
            item = getItemByItemId(item.getItemId());
        }catch (CannotGetJdbcConnectionException ex)
        {
            throw new DaoException("Cannot access database",ex);
        }catch(DataIntegrityViolationException ex)
        {
            throw new DaoException("Data integrity violation",ex);
        }

        return item;
    }

    public Item getItemByItemId(int itemId) {
        Item item =  new Item();
        String sql = "select item_id, description, damage, image from item where item_id = ?";
        try {
            SqlRowSet rs = jdbcTemplate.queryForRowSet(sql, itemId);
            if (rs.next()) {
                item = mapRowToItem(rs);
            }
        }
        catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return item;
    }

    public Item mapRowToItem(SqlRowSet rs) {
            Item item = new Item();
            item.setDamage(rs.getInt("damage"));
            item.setDescription(rs.getString("description"));
            item.setItemId(rs.getInt("item_id"));
            item.setImage(rs.getString("image"));
            return item;
        }
    }

