Vue.component('first-column', {
    props: {
        cards: Array,
        max: Number
    },
    template: `
    <div>
        <h2>First Column</h2>
        <p v-if="!cards.length">There are no cards yet.</p>
        <ul>
            <li v-for="card in cards">
                <p>{{ card.name }}</p>
            </li>
        </ul>
        <card @card-submitted="addCard"></card>
    </div>
    `,
    methods: {
        addCard(cardItem) {
            this.cards.push(cardItem);
        }
    },
});

Vue.component('second-column', {
    template: `
    <div>
        <h2>Second Column</h2>
    </div>
    `
})
Vue.component('third-column', {
    template: `
    <div>
        <h2>Third Column</h2>
    </div>
    `
})
Vue.component('card', {
    template: `
<div>
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
         <p>
           <label for="name">Name:</label>
           <input id="name" v-model="name" placeholder="Name">
         </p>
         <p>
           <input type="submit" value="Submit"> 
         </p>
    </form>
    </div>
    `,
    data() {
        return {
            name: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            if(this.name) {
                let cardItem = {
                    name: this.name,
                }
                this.$emit('card-submitted', cardItem)
                this.name = null
            } else {
                if(!this.name) this.errors.push("Name required.")
            }
        }
    }

})
let app = new Vue({
    el: '#app',
    data: {
        firstMax:3,
        secondMax:5,
        firstColumnCards: [],
        secondColumnCards: [],
        thirdColumnCards: [],
    },
    computed: {
        firstColumnBlocked() {

        },
    }
})



