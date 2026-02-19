
    Vue.component('card-item', {
    props: {
    card: { type: Object, required: true }
},
    data() {
    return {
    newItem: '',
    errorMessage: '',
};
},
    methods: {
    addItem() {
    const text = this.newItem.trim();
    if (!text) {
    this.errorMessage = 'Item cannot be empty.';
    return;
}
    if (this.card.items.length >= 5) {
    this.errorMessage = 'Maximum five points per card';
    return;
}
    this.card.items.push({ text, completed: false });
    this.newItem = '';
    this.errorMessage = '';
},
    onToggle(itemIndex, event) {
    this.$emit('toggle-item', {
    cardId: this.card.id,
    itemIndex: itemIndex,
    completed: event.target.checked
});
}
},
    template: `

    <div class="card">
    <h3>{{ card.name }}</h3>

<ul>
    <li v-for="(item, idx) in card.items" :key="idx">
    <input type="checkbox" v-model="item.completed" @change="onToggle(idx, $event)">
    <span :style="{ textDecoration: item.completed ? 'line-through' : 'none' }">
    {{ item.text }}
</span>
</li>
</ul>
<!--<div>-->
<!--    <input type="text" v-model="newItem" @keyup.enter="addItem" placeholder="New item">-->
<!--    <button @click="addItem">Add</button>-->
<!--<p v-if="errorMessage" class="error">{{ errorMessage }}</p>-->
<!--<p v-if="card.completedAt">Completed: {{ card.completedAt }}</p>-->
<!--</div>-->
</div>

`

});

Vue.component('add-card-form', {
    template: `

                <form @submit.prevent="onSubmit">
                    <p v-if="errors.length">
                        <b>Please correct the following error:</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                    </p>
                    <p>
                        <label for="name">Card name:</label>
                        <input id="name" v-model="name" placeholder="Enter card name">
                    </p>
                    <div>
                        <h4>Add items (min 3):</h4>
                        <ul v-if="tempItems.length">
                            <li v-for="(item, idx) in tempItems" :key="idx">
                                {{ item }}
                                <button type="button" @click="removeTempItem(idx)">✖</button>
                            </li>
</ul>
                        <div>
                            <input type="text" v-model="newItem" @keyup.enter="addTempItem" placeholder="Enter item">
                            <button type="button" @click="addTempItem">Add item</button>
                        </div>
                        <p>Added: {{ tempItems.length }}/3</p>
                    </div>
                    <p>
                        <input type="submit" value="Add card" :disabled="tempItems.length < 3 || !name">
                    </p>
                </form>
            `,
            data() {
                return {
                    name: '',
                    newItem: '',
                    tempItems: [],
                    errors: [],
                };
            },
            methods: {
                addTempItem() {
                    const text = this.newItem.trim();
                    if (text) {
                        this.tempItems.push(text);
                        this.newItem = '';
                    }
                },
                removeTempItem(index) {
                    this.tempItems.splice(index, 1);
                },
                onSubmit() {
                    this.errors = [];
                    if (!this.name.trim()) {
                        this.errors.push("Card name is required.");
                    }
                    if (this.tempItems.length < 3) {
                        this.errors.push("Please add at least 3 items.");
                    }
                    if (this.errors.length) return;
                    
                    this.$emit('add-card', {
                        name: this.name.trim(),
                        items: this.tempItems
                    });
                    
                    this.name = '';
                    this.tempItems = [];
                    this.newItem = '';
                }
            }
        });

        Vue.component('first-column', {
            props: {
                cards: Array,
                max: Number,
            },
            template: `
                <div>
                    <h2>First column (max {{ max }})</h2>
                    <div>
                        <p v-if="!cards.length">There are no cards yet.</p>
                        <div class="column-item">
                        <card-item v-for="card in cards" :key="card.id" :card="card" @toggle-item="$emit('toggle-item', $event)"></card-item>
                    </div>
                </div>
                </div>
          `,
        });

        Vue.component('second-column', {
            props: {
                cards: Array,
                max: Number
            },
            template: `
                <div>
                    <h2>Second column (max {{ max }})</h2>
                    <div>
                        <p v-if="!cards.length">There are no cards yet.</p>
                        <div class="column-item">
                        <card-item v-for="card in cards" :key="card.id" :card="card" @toggle-item="$emit('toggle-item', $event)"></card-item>
                    </div>
                </div>
                </div>
    `,
        });

        Vue.component('third-column', {
            props: {
                cards: Array
            },
            template:  `
                <div>
                    <h2>Third Column</h2>
                    <div>
                        <p v-if="!cards.length">There are no cards yet.</p>
                        <div class="column-item">
                        <card-item v-for="card in cards" :key="card.id" :card="card" @toggle-item="$emit('toggle-item', $event)"></card-item>
                    </div>
                </div>
                </div>
            `,
});

new Vue({
    el: '#app',
    data: {
        firstMax: 3,
        secondMax: 5,
        firstColumnCards: [],
        secondColumnCards: [],
        thirdColumnCards: [],
        nextCardId: 1,
    },
    created() {
        this.loadFromLocalStorage();
    },
    watch: {
        firstColumnCards: {handler: 'saveToLocalStorage', deep: true},
        secondColumnCards: {handler: 'saveToLocalStorage', deep: true},
        thirdColumnCards: {handler: 'saveToLocalStorage', deep: true}
    },
    methods: {
        addCard(cardData) {
            const items = cardData.items.map(text => ({
                text: text,
                completed: false
            }));

            const newCard = {
                id: this.nextCardId++,
                name: cardData.name,
                items: items,
                completedAt: null,
            };

            if (this.firstColumnCards.length < this.firstMax) {
                this.firstColumnCards.push(newCard);
            } else if (this.secondColumnCards.length < this.secondMax) {
                this.secondColumnCards.push(newCard);
            } else {
                this.thirdColumnCards.push(newCard);
            }

            this.saveToLocalStorage();
        },

        findCardById(id) {
            return this.firstColumnCards.find(card => card.id === id) ||
                this.secondColumnCards.find(card => card.id === id) ||
                this.thirdColumnCards.find(card => card.id === id);
        },

        getCompletionPercent(card) {
            if (!card.items.length) return 0;
            const completedCount = card.items.filter(item => item.completed).length;
            return (completedCount / card.items.length) * 100;
        },

        moveCard(card, fromArray, toArray) {
            const index = fromArray.indexOf(card);
            if (index !== -1) {
                fromArray.splice(index, 1);
                toArray.push(card);
            }
        },

        handleToggleItem({cardId, itemIndex, completed}) {
            const card = this.findCardById(cardId);
            if (!card) return;

            const percent = this.getCompletionPercent(card);

            let currentColumn = null;
            let targetColumn = null;

            if (this.firstColumnCards.includes(card)) {
                currentColumn = this.firstColumnCards;
                if (percent > 50) {
                    targetColumn = this.secondColumnCards;
                }
            } else if (this.secondColumnCards.includes(card)) {
                currentColumn = this.secondColumnCards;
                if (percent === 100) {
                    targetColumn = this.thirdColumnCards;
                    card.completedAt = new Date().toLocaleString();
                }
            } else {
                return;
            }

            if (targetColumn && targetColumn !== currentColumn) {
                this.moveCard(card, currentColumn, targetColumn);
            }
        },

        loadFromLocalStorage() {
            const saved = localStorage.getItem('trelloData');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    this.firstColumnCards = data.firstColumnCards || [];
                    this.secondColumnCards = data.secondColumnCards || [];
                    this.thirdColumnCards = data.thirdColumnCards || [];
                    this.nextCardId = data.nextCardId || 1;
                } catch (e) {
                    console.error('Ошибка загрузки', e);
                }
            }
        },

        saveToLocalStorage() {
            const data = {
                firstColumnCards: this.firstColumnCards,
                secondColumnCards: this.secondColumnCards,
                thirdColumnCards: this.thirdColumnCards,
                nextCardId: this.nextCardId
            };
            localStorage.setItem('trelloData', JSON.stringify(data));
        },
    }
});

