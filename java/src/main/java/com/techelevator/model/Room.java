package com.techelevator.model;

import java.util.Objects;

public class Room {
    private int roomId;
    private String description;
   private int roomType;
    private Integer eastRoom;
    private Integer westRoom;
    private boolean finalRoom;
    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getRoomType() {
        return roomType;
    }

    public void setRoomType(int roomType) {
        this.roomType = roomType;
    }

    public Integer getEastRoom() {
        return eastRoom;
    }

    public void setEastRoom(Integer eastRoom) {
        this.eastRoom = eastRoom;
    }

    public Integer getWestRoom() {
        return westRoom;
    }

    public void setWestRoom(Integer westRoom) {
        this.westRoom = westRoom;
    }

    public boolean isFinalRoom() {
        return finalRoom;
    }

    public void setFinalRoom(boolean finalRoom) {
        this.finalRoom = finalRoom;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Room room = (Room) o;

        if (roomId != room.roomId) return false;
        if (roomType != room.roomType) return false;
        if (finalRoom != room.finalRoom) return false;
        if (!Objects.equals(description, room.description)) return false;
        if (!Objects.equals(eastRoom, room.eastRoom)) return false;
        return Objects.equals(westRoom, room.westRoom);
    }

    @Override
    public int hashCode() {
        int result = roomId;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + roomType;
        result = 31 * result + (eastRoom != null ? eastRoom.hashCode() : 0);
        result = 31 * result + (westRoom != null ? westRoom.hashCode() : 0);
        result = 31 * result + (finalRoom ? 1 : 0);
        return result;
    }
}
