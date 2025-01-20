package com.techelevator.dao;


import com.techelevator.exception.DaoException;
import com.techelevator.model.Room;

import java.util.List;

public interface RoomDao {
    Room getRoomById(int roomId) throws DaoException;

    Room getFirstRoom() throws DaoException;

    Room createRoom(Room room) throws DaoException;
    List<Room> getAllRooms() throws DaoException;
    void deleteRoom(int roomId) throws DaoException;

    Room updateRoom(Room room) throws DaoException;
}
