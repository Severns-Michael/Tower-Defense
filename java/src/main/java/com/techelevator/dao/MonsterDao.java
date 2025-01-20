package com.techelevator.dao;

import com.techelevator.exception.DaoException;
import com.techelevator.model.Monster;

public interface MonsterDao {
    Monster getMonsterByRoomId(int roomId) throws DaoException;
    Monster createMonster(Monster monster) throws DaoException;
    Monster updateMonster(Monster monster) throws DaoException;
    void deleteMonster(int monsterId) throws DaoException;
    Monster getMonsterByMonsterId(int monsterId) throws DaoException;
}
