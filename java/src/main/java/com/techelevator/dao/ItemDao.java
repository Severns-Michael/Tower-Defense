package com.techelevator.dao;


import com.techelevator.exception.DaoException;
import com.techelevator.model.Item;

import java.util.List;

public interface ItemDao {
    List<Item> getItemsByRoomId(int roomId) throws DaoException;

    List<Item> getAllItems() throws DaoException;
    Item createItem(Item item) throws DaoException;
    void deleteItem(int itemId) throws DaoException;
    Item updateItem(Item item) throws DaoException;
    Item getItemByItemId(int itemId) throws DaoException;
}
