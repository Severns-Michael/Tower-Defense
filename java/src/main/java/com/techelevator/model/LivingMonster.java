package com.techelevator.model;

public class LivingMonster extends Monster {
    private boolean isAsleep;


    public LivingMonster(int health, boolean isFriendly, String name, double speed, boolean isAsleep,int monsterType) {
        super(health, isFriendly, name, speed, monsterType);
        this.isAsleep=isAsleep;
    }

    public boolean getIsAsleep()
    {
        return this.isAsleep;
    }

    @Override
    public int attack()
    {
        if(!this.getIsFriendly())
        {
            return 10;
        }
        else
        {
            return 0;
        }
    }

    @Override
    public String toString()
    {
        if(this.getIsFriendly())
            return this.getName()+" gives you a big hug";
        else
            return this.getName()+" is angry - it attacks.";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        LivingMonster that = (LivingMonster) o;

        return isAsleep == that.isAsleep;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (isAsleep ? 1 : 0);
        return result;
    }
}
