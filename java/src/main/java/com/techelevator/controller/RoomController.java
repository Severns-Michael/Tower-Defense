package com.techelevator.controller;

import com.techelevator.dao.RoomDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    private RoomDao roomDao;

    /*
    Room getRoomById(int roomId) throws DaoException;

    Room getFirstRoom() throws DaoException;

    Room createRoom(Room room) throws DaoException;
    List<Room> getAllRooms() throws DaoException;
    void deleteRoom(int roomId) throws DaoException;

    Room updateRoom(Room room) throws DaoException;

    GET /rooms/{id}     SUCCESS 200 OK returns Room or null
    GET /rooms/first    SUCCESS 200 OK returns Room or null
    POST /rooms         SUCCESS 201 CREATED return new Room or null
    GET /rooms          SUCESSS 200 OK return List<Room> or empty list
    DELETE /rooms/{id}  SUCCESS 204 NO CONTENT no return
    PUT /rooms          SUCESSS 200 OK return updated room or null
     */
    @RequestMapping (path = "/{roomID}", method = RequestMethod.GET)
    public Room getRoom(@PathVariable int roomID){
        Room room;
        try {
            room = roomDao.getRoomById(roomID);
            return room;
        } catch (DaoException e) {

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room Not Found");
        }
    }

    @RequestMapping (path = "/first", method = RequestMethod.GET)
    public Room getFirstRoom(){
        Room room;
        try {
            room = roomDao.getFirstRoom();
            return room;
        } catch (DaoException e) {

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room Not Found");
        }
    }

    @RequestMapping (path= "", method = RequestMethod.POST)
    @ResponseStatus (HttpStatus.CREATED)
    public Room createRoom(@RequestBody Room newRoom){
        try {
            return roomDao.createRoom(newRoom);
        } catch (DaoException e) {

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room Not Found");
        }
    }

    @RequestMapping (path = "" ,method = RequestMethod.GET)
    public List<Room> getRooms(){
        List<Room> rooms = new ArrayList<>();
        try {
            return roomDao.getAllRooms();
        } catch (DaoException e) {

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room Not Found");
        }
    }
    @RequestMapping (path = "/{roomID}", method = RequestMethod.DELETE)
    @ResponseStatus (HttpStatus.NO_CONTENT)
    public void deleteRoom(@PathVariable int roomID){
        try {
            roomDao.deleteRoom(roomID);;
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room Not Found");
        }
    }
    @RequestMapping (method = RequestMethod.PUT)
    public Room updateRoom(@RequestBody Room changedRoom){
        Room room = null;
        try {
            return roomDao.updateRoom(changedRoom);
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room Not Found");
        }
    }
}

