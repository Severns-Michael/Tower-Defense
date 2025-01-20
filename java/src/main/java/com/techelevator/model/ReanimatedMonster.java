package com.techelevator.model;

public class ReanimatedMonster extends Monster {
    private double attackFactor;
    public ReanimatedMonster(int health, boolean isFriendly, String name, double speed, double attackFactor, int monsterType) {
        super(health, isFriendly, name, speed, monsterType);
        this.attackFactor=attackFactor;
    }

    @Override
    public int attack()
    {
        int damage = 10;
        return (int)(damage * this.attackFactor);
    }

    public double getAttackFactor()
    {
        return this.attackFactor;
    }

    @Override
    public String toString()
    {
        return this.getName()+" attacks - look out!";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        ReanimatedMonster that = (ReanimatedMonster) o;

        return Double.compare(attackFactor, that.attackFactor) == 0;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        long temp;
        temp = Double.doubleToLongBits(attackFactor);
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        return result;
    }
}
