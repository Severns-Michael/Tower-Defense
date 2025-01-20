package com.techelevator.model;

import java.util.Objects;

public class Item {
    private int itemId=0;
    private String description;
    private int damage=0;

    private String image;

    public int getDamage() {
        return damage;
    }

    public void setDamage(int damage) {
        this.damage = damage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Item item = (Item) o;

        if (itemId != item.itemId) return false;
        if (damage != item.damage) return false;
        return Objects.equals(description, item.description);
    }

    @Override
    public int hashCode() {
        int result = itemId;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + damage;
        return result;
    }
}
