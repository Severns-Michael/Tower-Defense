package com.techelevator.controller;
import com.techelevator.dao.MonsterDao;
import com.techelevator.exception.DaoException;
import com.techelevator.model.LivingMonster;
import com.techelevator.model.Monster;
import com.techelevator.model.ReanimatedMonster;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping(path = "/re/")
public class ReanimatedMonsterController {
    @Autowired
    private MonsterDao monsterDao;

    public ReanimatedMonsterController() {
    }

    /**
     * API for getMonsterByMonsterId()
     * path: http://localhost:8080/monsters/{id}
     * request method: GET
     * path variable: monsterId for the specific monster to retrieve
     * return: the monster that has the specified id
     * status code/s: 200 OK
     */
    @RequestMapping(path = "/monsters/{id}", method = RequestMethod.GET)
    public Monster getReanimatedMonsterByMonsterId(@PathVariable int id) {
        ReanimatedMonster monster = (ReanimatedMonster) monsterDao.getMonsterByMonsterId(id);
        return monster;
    }

    /**
     * API for getMonsterByRoomId()
     * path: http://localhost:8080/monsters/room/{id}
     * request method: GET
     * path variable: roomId for the specific monster to retrieve
     * return: the monster that has the specified roomid
     * status code/s: 200 OK
     */
    @RequestMapping(path = "/monsters/room/{id}", method = RequestMethod.GET)
    public Monster getReanimatedMonsterByRoomId(@PathVariable int id) {
        ReanimatedMonster monster = (ReanimatedMonster) monsterDao.getMonsterByRoomId(id);
        return monster;
    }

//    /**
//     * API for createLivingMonster()
//     * path: http://localhost:8080/monsters
//     * request method: POST
//     * request body: the living monster object to be added
//     * return: the living monster object that was added
//     * status code/s: 201 CREATED
//     */
//    @ResponseStatus(HttpStatus.CREATED)
//    @RequestMapping(path = "/monsters", method = RequestMethod.POST)
//    public LivingMonster createLivingMonster(@Valid @RequestBody LivingMonster monster) {
//        LivingMonster newMonster = (LivingMonster) monsterDao.createMonster(monster);
//        return newMonster;
//
//    }

    /**
     * API for createReanimatedMonster()
     * path: http://localhost:8080/monsters
     * request method: POST
     * request body: the reanimted monster object to be added
     * return: the reanimted monster object that was added
     * status code/s: 201 CREATED
     */
    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(path = "/monsters", method = RequestMethod.POST)
    public ReanimatedMonster createReanimatedMonster(@Valid @RequestBody ReanimatedMonster monster) {
        ReanimatedMonster newMonster = (ReanimatedMonster) monsterDao.createMonster(monster);
        return newMonster;
    }

    /**
     * API for updateMonster()
     * path: http://localhost:8080/monsters/{id}
     * request method: PUT
     * path variable: monsterId for the specific monster to update
     * return: the updated monster that has the specified id
     * status code/s: 200 OK
     */
    @RequestMapping(path = "/monsters/{id}", method = RequestMethod.PUT)
    public Monster updateReanimatedMonster(@Valid @PathVariable int id, @RequestBody ReanimatedMonster monster) {
        monster.setMonsterId(id);
        try {
            ReanimatedMonster updatedMonster = (ReanimatedMonster) monsterDao.updateMonster(monster);
            if (updatedMonster != null) {
                return updatedMonster;
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "This isnt supposed to happen but blame it on josh");
            }
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Monster " + id + " was not found");
        }
    }

    /**
     * API for deleteMonster()
     * path: http://localhost:8080/monsters/{id}
     * request method: DELETE
     * path variable: monsterId for the specific monster to delete
     * status code/s: 204 NO_CONTENT
     */
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping(path = "/monsters/{id}", method = RequestMethod.DELETE)
    public void deleteReanimatedMonster(@PathVariable int id) {
        ReanimatedMonster monster = (ReanimatedMonster) getReanimatedMonsterByMonsterId(id);
        if (monster != null) {
            monsterDao.deleteMonster(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Monster " + id + " was not found");
        }
    }
}