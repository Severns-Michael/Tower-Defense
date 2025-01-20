<template>
    <div id="additemform">
        <form class="itemForm" v-on:submit.prevent="addItem">
            <div class="form-group">
                <label for="description">Description:</label>
                <input id="description" type="text" class="form-control" v-model="newItem.description"/>
            </div>
            <div class="form-group">
                <label for="firstName">Damage:</label>
                <input id="damage" type="number" class="form-control" v-model.number="newItem.damage"/>
            </div>

            <button class="btn btn-submit" type="submit">Submit</button>
            <button class="btn btn-cancel" type="cancel">Cancel</button>
        </form>
    </div>
</template>

<script>

import ItemService from '../services/ItemService.js';
export default {



    data() {
        return {
            newItem: {
                description: '',
                damage: 0
            },
           
        }
    },
    methods: {
        addItem() {
           ItemService.addItem(this.newItem).then( response => {
             if (response.status === 201) {
                 console.log(response.data);
                 this.newItem = {};
                 this.$router.push('searchItem');
             }
           }).catch( error =>{
            console.log(error)
           })
        }
    }

}
</script>

<style scoped>

#additemform {
            margin-left: auto;
            margin-right: auto;
            width: 500px;
        }

        form input {
            width: 100%;
        }

        .itemForm {
            padding: 10px;
            margin-bottom: 10px;
        }

        .form-group {
            margin-bottom: 10px;
            margin-top: 10px;
        }

        .form-control {
            display: flex;
            align-items: flex-start;
            width: 100%;
            height: 30px;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #495057;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
        }

        textarea.form-control {
            height: 75px;
            font-family: Arial, Helvetica, sans-serif;
        }

        select.form-control {
            width: 20%;
            display: inline-block;
            margin: 10px 20px 10px 10px;
        }

        .btn-submit {
            color: #fff;
            padding: 10px 24px;
            background-color: #38b412;
            box-shadow: 0 12px 26px 0 rgba(0, 0, 0, 0.24),
                0 17px 50px 0 rgba(0, 0, 0, 0.19);
        }

        .btn-cancel {
            padding: 10px 24px;
            box-shadow: 0 12px 26px 0 rgba(0, 0, 0, 0.24),
                0 17px 50px 0 rgba(0, 0, 0, 0.19);
        }

        .btn-submit:hover {
            color: #fff;
            padding: 10px 24px;
            background-color: #65f307;
            box-shadow: 0 12px 26px 0 rgba(0, 0, 0, 0.24),
                0 17px 50px 0 rgba(0, 0, 0, 0.19);
        }

        .btn-cancel:hover {
            padding: 10px 24px;
            background-color: #65f307;
            box-shadow: 0 12px 26px 0 rgba(0, 0, 0, 0.24),
                0 17px 50px 0 rgba(0, 0, 0, 0.19);
        }

        .status-message {
            display: block;
            border-radius: 5px;
            font-weight: bold;
            font-size: 1rem;
            text-align: center;
            padding: 10px;
            margin-bottom: 10px;
        }

        .status-message.success {
            background-color: #90ee90;
        }

        .status-message.error {
            background-color: #f08080;
        }

</style>