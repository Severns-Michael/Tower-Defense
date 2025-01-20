<template>
    <div id="container">

        <div id="seachItemBox">
          <label for="">Search Item</label>
          <input type="text" name="itemName" v-model="nameFilter">
        </div>

        <div class="divTable greenTable">
            <div class="divTableHeading">
                <div class="divTableRow">
                    <div class="divTableHead"></div>
                    <div class="divTableHead">Description</div>
                    <div class="divTableHead">Damage</div>
                    <div class="divTableHead">Item Id</div>
                </div>
            </div>
            <div class="divTableBody">
                <div class="divTableRow" v-for="item in filteredItems" v-bind:key="item.itemId">
                    <div class="divTableCell">
                        <img v-bind:src=item.image v-bind:alt=item.description>
                    </div>
                    <div class="divTableCell">{{item.description}}</div>
                    <div class="divTableCell">{{item.damage}}</div>
                    <div class="divTableCell">{{item.itemId}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import itemService from '../services/ItemService';

export default {

    data() {
        return {
           nameFilter: '',
           items: []
        }
    },
    computed: {
        filteredItems() {
            const ourItems = this.items
             
            return ourItems.filter( (item) => {
              return this.nameFilter == '' ? true : item.description.toLowerCase().includes(this.nameFilter.toLowerCase());
            });

        }
    },
    created() {

        itemService.getItems().then(response => {
           this.items = response.data;
        }) 

    }

}
</script>

<style scoped>

input[type=text] {
  margin: 10px;
  width:50%;
  padding: 8px 16px;
  border: 2px solid cornflowerblue;
  border-radius: 4px;
}

#container {
  display: flex;
  flex-direction: column;
  justify-content: center;;
    align-items: center;
    width: 100%;
}

.divTableCell img {
    width: 10%;
    height: auto;
}


div.greenTable {
  font-family: Georgia, serif;
  border: 6px solid #white;
  background-color: #white;
  width: 50%;
  text-align: center;
}
.divTable.greenTable .divTableCell, .divTable.greenTable .divTableHead {
  border: 1px solid #4A8694;
  padding: 3px 2px;
}
.divTable.greenTable .divTableBody .divTableCell {
  font-size: 13px;
}
.divTable.greenTable .divTableHeading {
  background: #4A8694;
  background: -moz-linear-gradient(top, #77a4af 0%, #5c929e 66%, #4A8694 100%);
  background: -webkit-linear-gradient(top, #77a4af 0%, #5c929e 66%, #4A8694 100%);
  background: linear-gradient(to bottom, #77a4af 0%, #5c929e 66%, #4A8694 100%);
  border-bottom: 0px solid #444444;
}
.divTable.greenTable .divTableHeading .divTableHead {
  font-size: 19px;
  font-weight: bold;
  color: #F0F0F0;
  text-align: left;
  border-left: 2px solid #4A8694;
}
.divTable.greenTable .divTableHeading .divTableHead:first-child {
  border-left: none;
}

.greenTable .tableFootStyle {
  font-size: 13px;
}
.greenTable .tableFootStyle .links {
	 text-align: right;
}
.greenTable .tableFootStyle .links a{
  display: inline-block;
  background: #FFFFFF;
  color: #24943A;
  padding: 2px 8px;
  border-radius: 5px;
}
.greenTable.outerTableFooter {
  border-top: none;
}
.greenTable.outerTableFooter .tableFootStyle {
  padding: 3px 5px; 
}
/* DivTable.com */
.divTable{ display: table; }
.divTableRow { display: table-row; }
.divTableHeading { display: table-header-group;}
.divTableCell, .divTableHead { display: table-cell;}
.divTableHeading { display: table-header-group;}
.divTableFoot { display: table-footer-group;}
.divTableBody { display: table-row-group;}

</style>