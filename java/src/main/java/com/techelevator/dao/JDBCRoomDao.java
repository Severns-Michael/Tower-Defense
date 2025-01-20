package com.techelevator.dao;


import com.techelevator.exception.DaoException;
import com.techelevator.model.Room;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;



@Component
public class JDBCRoomDao implements RoomDao {

    private final JdbcTemplate jdbcTemplate;

    public JDBCRoomDao(DataSource dataSource) {
        jdbcTemplate = new JdbcTemplate(dataSource);
    }


    @Override
    public Room getRoomById(int roomId) throws DaoException {
        Room room = null;
        String sql = "select * from room where room_Id=?";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, roomId);
            if (results.next()) {
                room = mapRowToRoom(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return room;
    }

    @Override
    public Room getFirstRoom() throws DaoException {
        Room room = null;

        String sql = "select * from room order by room_id asc limit 1";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            if (results.next()) {
                room = mapRowToRoom(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return room;
    }


    @Override
    public Room createRoom(Room room) throws DaoException {
        int newRoomId = -1;
        String sql = "insert into room (description,room_type,east_door,west_door,final_room )" +
                " values (?,?,?,?,?) returning room_id;";

        try {
            newRoomId = jdbcTemplate.queryForObject(sql, int.class, room.getDescription(), room.getRoomType(), room.getEastRoom(), room.getWestRoom(), room.isFinalRoom());
            room = getRoomById(newRoomId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {

            throw new DaoException("Data integrity violation", e);
        }
        return room;

    }

    @Override
    public List<Room> getAllRooms() throws DaoException {
        List<Room> rooms = new ArrayList<>();
        String sql = "select * from room;";

        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql);
            while (results.next()) {
                rooms.add(mapRowToRoom(results));
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

        return rooms;


    }

    @Override
    public void deleteRoom(int roomId) {
        String sql = "delete from room where room_id=?";
        String preSql = "delete from room_item where room_id=?";
        try {
            jdbcTemplate.update(preSql, roomId);
            jdbcTemplate.update(sql, roomId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Can not connect to DB", e);
        } catch (DataIntegrityViolationException ex) {
            throw new DaoException("Data violation", ex);
        }
    }

    @Override
    public Room updateRoom(Room room) {
        String sql = "UPDATE public.room " +
                "SET description=?, room_type=?, east_door=?, west_door=?, final_room=? " +
                "WHERE room_id=?;";
        try {
            int rows = jdbcTemplate.update(sql, room.getDescription(), room.getRoomType(), room.getEastRoom(), room.getWestRoom(), room.isFinalRoom(), room.getRoomId());
            if (rows != 1) {
                throw new DaoException("There was a problem with the update statement in rooms");
            }
            room = getRoomById(room.getRoomId());
        } catch (Exception ex) {
            throw new DaoException("There was a problem", ex);
        }

        return room;
    }

    private Room mapRowToRoom(SqlRowSet rowSet) {
        Room room = new Room();
        room.setRoomId(rowSet.getInt("room_id"));
        room.setDescription(rowSet.getString("description"));
        room.setRoomType(rowSet.getInt("room_type"));
        room.setEastRoom(rowSet.getObject("east_door") == null ? null : rowSet.getInt("east_door"));
        room.setWestRoom(rowSet.getObject("west_door") == null ? null : rowSet.getInt("west_door"));
        room.setFinalRoom(rowSet.getBoolean("final_room"));
        return room;
    }


}


