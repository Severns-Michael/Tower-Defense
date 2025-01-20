package com.techelevator.model;

import java.util.Objects;

public class Monster {
    private int health;
    private boolean isFriendly;
    private String name;
    private double movementSpeed;
    private int monsterId;
    private int monsterType;
    private int roomId;
    private Integer itemId;

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public int getMonsterId() {
        return monsterId;
    }

    public void setMonsterId(int monsterId) {
        this.monsterId = monsterId;
    }

    public Monster(int health, boolean isFriendly, String name, double speed, int monsterType)
    {
        this.health = health;
        this.isFriendly=isFriendly;
        this.name=name;
        this.movementSpeed = speed;
        this.monsterType = monsterType;
    }

    public int attack()
    {
        int damage = 10;
        return damage;
    }

    public double getMovementSpeed()
    {
        return this.movementSpeed;
    }
    public void setMovementSpeed(double movementSpeed)
    {
        this.movementSpeed = movementSpeed;
    }
    public int getHealth() {
        return health;
    }

    public void setHealth(int health) {
        this.health = health;
    }

    public boolean getIsFriendly() {
        return isFriendly;
    }

    public void setIsFriendly(boolean friendly) {
        isFriendly = friendly;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString()
    {
        return "The monster attacks!";
    }

    public int getMonsterType() {
        return monsterType;
    }

    public void setMonsterType(int monsterType) {
        this.monsterType = monsterType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Monster monster = (Monster) o;

        if (health != monster.health) return false;
        if (isFriendly != monster.isFriendly) return false;
        if (Double.compare(movementSpeed, monster.movementSpeed) != 0) return false;
        if (monsterId != monster.monsterId) return false;
        if (monsterType != monster.monsterType) return false;
        if (roomId != monster.roomId) return false;
        if (!Objects.equals(name, monster.name)) return false;
        return Objects.equals(itemId, monster.itemId);
    }

    @Override
    public int hashCode() {
        int result;
        long temp;
        result = health;
        result = 31 * result + (isFriendly ? 1 : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        temp = Double.doubleToLongBits(movementSpeed);
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        result = 31 * result + monsterId;
        result = 31 * result + monsterType;
        result = 31 * result + roomId;
        result = 31 * result + (itemId != null ? itemId.hashCode() : 0);
        return result;
    }
}
