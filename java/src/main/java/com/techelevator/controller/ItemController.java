package com.techelevator.controller;
import com.techelevator.dao.ItemDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.Item;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;

@RestController
@CrossOrigin
//@PreAuthorize("isAuthenticated()")
public class ItemController {
    @Autowired
    private ItemDao itemDao;
    private String BASE_URL = "/items";

    /**
     * /items/room/{roomId]}
     * @param roomId the room ID to filter by
     * @return a list of items that match the room ID
     * @throws DaoException
     */
    @PreAuthorize("permitAll()")
    @RequestMapping(path = "/items/rooms/{roomId}", method = RequestMethod.GET)
    public List<Item> listByRoomId(@PathVariable int roomId) throws DaoException{
        return itemDao.getItemsByRoomId(roomId);
    }

    @PreAuthorize("permitAll()")
    @RequestMapping(path = "/items", method = RequestMethod.GET)
    public List<Item> getAllItems() throws DaoException {
        return itemDao.getAllItems();
    }

    /**
     * /items
     * @param item you would like to create
     * @return created item
     */
    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(path= "/items", method = RequestMethod.POST)
    public Item addItem(@Valid @RequestBody Item item) throws DaoException{
        return itemDao.createItem(item);
    }

    /**
     * path = /items/{id}
     * @param id the ID of the item you would like to delete
     * @throws DaoException
     */
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(path="/items/{id}", method = RequestMethod.DELETE)
    public void deleteItem(@Valid @PathVariable int id) throws DaoException{

        itemDao.deleteItem(id);
    }

    /**
     * /items
     * success status = 418 "I am a teapot"
     * @param item item you would like to update.
     * @return the updated item.
     * @throws DaoException
     */
    @ResponseStatus(HttpStatus.I_AM_A_TEAPOT)
    @RequestMapping(path = "/items", method = RequestMethod.PUT)
    public Item udpateItem(@Valid @PathVariable Item item)throws DaoException{
        return itemDao.updateItem(item);
    }

    /**
     * path = /items/itemId
     * @param itemId the id of the item to return
     * @return returns the item with the specified id
     */
    @GetMapping(path="/items/{itemId}")
    @ResponseStatus(HttpStatus.OK)
    public Item getItemById (@PathVariable int itemId){
        if(itemDao.getItemByItemId(itemId).getItemId() == 0){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else{

            return itemDao.getItemByItemId(itemId);
        }

    }


}