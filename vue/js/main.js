
// Компонент формы для добавления новой карточки
Vue.component('add-card-form', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <p>
        <label for="name">Card name:</label>
        <input id="name" v-model="name" placeholder="Enter card name">
      </p>
      <p>
        <input type="submit" value="Add card">
      </p>
    </form>
  `,
    data() {
        return {
            name: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (this.name && this.name.trim()) {
                this.$emit('add-card', this.name.trim());
                this.name = null;
            } else {
                this.errors.push("Name is required.");
            }
        }
    }
});
// Компонент одной карточки с возможностью добавлять элементы списка
Vue.component('card-item', {
    props: {
        card: { type: Object, required: true }
    },
    template: `
        <div class="card">
          <h3>{{ card.name }}</h3>
          <ul>
            <li v-for="(item, idx) in card.items" :key="idx">{{ item }}</li>
          </ul>
          <div>
            <input v-model="newItem" @keyup.enter="addItem" placeholder="New item">
            <button @click="addItem">Add</button>
          </div>
        </div>
      `,
    data() {
        return {
            newItem: ''
        };
    },
    methods: {
        addItem() {
            if (this.newItem.trim()) {
                this.card.items.push(this.newItem.trim());
                this.newItem = '';
            }
        }
    }
});

// Столбцы
Vue.component('first-column', {
    props: {
        cards: Array,
        max: Number,
        columnName: String
    },
    template: `
        <div class="column">
          <h2>{{ columnName }} Column (max {{ max }})</h2>
          <p v-if="!cards.length">There are no cards yet.</p>
          <card-item v-for="card in cards" :key="card.id" :card="card"></card-item>
        </div>
      `
});

Vue.component('second-column', {
    props: {
        cards: Array,
        max: Number
    },
    template: `
        <div class="column">
          <h2>Second Column (max {{ max }})</h2>
          <p v-if="!cards.length">There are no cards yet.</p>
          <card-item v-for="card in cards" :key="card.id" :card="card"></card-item>
        </div>
      `
});

Vue.component('third-column', {
    props: {
        cards: Array
    },
    template: `
        <div class="column">
          <h2>Third Column (unlimited)</h2>
          <p v-if="!cards.length">There are no cards yet.</p>
          <card-item v-for="card in cards" :key="card.id" :card="card"></card-item>
        </div>
      `
});

// Корневой экземпляр
new Vue({
    el: '#app',
    data: {
        firstMax: 3,
        secondMax: 5,
        firstColumnCards: [],
        secondColumnCards: [],
        thirdColumnCards: [],
        nextCardId: 1
    },
    methods: {
        addCard(cardName) {
            const newCard = {
                id: this.nextCardId++,
                name: cardName,
                items: []
            };

            if (this.firstColumnCards.length < this.firstMax) {
                this.firstColumnCards.push(newCard);
            } else if (this.secondColumnCards.length < this.secondMax) {
                this.secondColumnCards.push(newCard);
            } else {
                this.thirdColumnCards.push(newCard);
            }
        }
    }
});
