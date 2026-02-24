
Vue.component('draggable', vuedraggable);

Vue.component('card-item', {
    props: {
        card: { type: Object, required: true },
        disabled: { type: Boolean, default: false }
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
                <div class="nameCard">{{ card.name }}</div>
                <p v-for="(item, idx) in card.items" :key="idx">
                    <input
                        v-if="!card.completedAt"
                        type="checkbox"
                        v-model="item.completed"
                        @change="onToggle(idx, $event)"
                        :disabled="disabled"  
                    >
                    <span :style="{ textDecoration: item.completed ? 'line-through' : 'none' }">
                        {{ item.text }}
                    </span>
                </p>
                <div>
                    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
                    <p v-if="card.completedAt">Completed: {{ card.completedAt }}</p>
                </div>
            </div>
        `
});

Vue.component('add-card-form', {
    props: {
        formDisabled: { type: Boolean, default: false }
    },
    template: `
            <form @submit.prevent="onSubmit">
                <p v-if="errors.length">
                    <b>Please correct the following error:</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </p>
            
                <div class="notes">
                    <div class="note">
                        <p>
                            <label for="name">Card name:</label>
                            <input id="name" v-model="name" placeholder="Enter card name">
                        </p>
                        <p>
                <label for="deadline">Deadline:</label>
                <input type="datetime-local" id="deadline" v-model="deadline">
            </p>
                        <div>
                            <h4>Add items (min 3):</h4>
                            <ul v-if="tempItems.length">
                                <li v-for="(item, idx) in tempItems" :key="idx">
                                    {{ item }}
                                </li>
                            </ul>
                            <div>
                                <input type="text" v-model="newItem" @keyup.enter="addTempItem" placeholder="Enter item">
                                <button type="button" :disabled="tempItems.length >= 5" @click="addTempItem">Add item</button>
                            </div>
                            <p>Added: {{ tempItems.length }}/5</p>
                        </div>
                        <p>
                            <input type="submit" value="Add card"  :disabled="formDisabled || tempItems.length < 3 || !name">
                        </p>
                    </div>
                </div>
            </form>
        `,
    data() {
        return {
            name: '',
            newItem: '',
            tempItems: [],
            errors: [],
            deadline: '',
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
                items: this.tempItems,
                deadline: this.deadline ? new Date(this.deadline).getTime() : null,
            });

            this.name = '';
            this.tempItems = [];
            this.newItem = '';
            this.deadline = '';
        }
    }
});

Vue.component('first-column', {
    props: {
        value: { type: Array, required: true },
        max: Number,
        locked: Boolean,
    },
    computed: {
        columnCards: {
            get() { return this.value; },
            set(newVal) { this.$emit('input', newVal); }
        }
    },
    template: `
        <div>
            <h2>First column (max {{ max }})</h2>
            <div>
                <p v-if="!value.length">You haven't added any cards yet.</p>
                <draggable v-model="columnCards" :disabled="locked" item-key="id" tag="div" class="column-item">
                    <div v-for="card in columnCards" :key="card.id">
                        <card-item :card="card" @toggle-item="$emit('toggle-item', $event)" :disabled="locked"></card-item>
                    </div>
                </draggable>
            </div>
        </div>
    `
});

Vue.component('second-column', {
    props: {
        value: { type: Array, required: true },
        max: Number
    },
    computed: {
        columnCards: {
            get() { return this.value; },
            set(newVal) { this.$emit('input', newVal); }
        }
    },
    template: `
        <div>
            <h2>Second column (max {{ max }})</h2>
            <div>
                <p v-if="!value.length">You haven't added any cards yet.</p>
                <draggable v-model="columnCards" item-key="id" tag="div" class="column-item">
                    <div v-for="card in columnCards" :key="card.id">
                        <card-item :card="card" @toggle-item="$emit('toggle-item', $event)"></card-item>
                    </div>
                </draggable>
            </div>
        </div>
    `
});

Vue.component('third-column', {
    props: {
        value: { type: Array, required: true }
    },
    computed: {
        columnCards: {
            get() { return this.value; },
            set(newVal) { this.$emit('input', newVal); }
        }
    },
    template: `
        <div>
            <h2>Third Column</h2>
            <div>
                <p v-if="!value.length">You haven't added any cards yet.</p>
                <draggable v-model="columnCards" item-key="id" tag="div" class="column-item">
                    <div v-for="card in columnCards" :key="card.id">
                        <card-item :card="card" @toggle-item="$emit('toggle-item', $event)"></card-item>
                    </div>
                </draggable>
            </div>
        </div>
    `
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
    computed: {
        isFirstColumnLocked() {
            return this.secondColumnCards.length >= this.secondMax &&
                this.firstColumnCards.some(card => this.getCompletionPercent(card) > 50);
        },
        canAddNewCard() {
            return this.firstColumnCards.length < this.firstMax ||
                this.secondColumnCards.length < this.secondMax;
        },
        overdueCount() {
            const now = Date.now();
            const activeCards = [...this.firstColumnCards, ...this.secondColumnCards, ...this.thirdColumnCards];
            return activeCards.filter(card => card.deadline && card.deadline < now).length;
        },

        // Пункт 5: отношение выполненных задач к невыполненным
        totalStats() {
            let total = 0;
            let completed = 0;
            const allCards = [...this.firstColumnCards, ...this.secondColumnCards, ...this.thirdColumnCards];
            allCards.forEach(card => {
                card.items.forEach(item => {
                    total++;
                    if (item.completed) completed++;
                });
            });
            const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
            return { completed, total, percent };
        }
    },
    created() {
        this.loadFromLocalStorage();
    },
    watch: {
        isFirstColumnLocked(newVal, oldVal) {
            if (oldVal === true && newVal === false) {
                this.processPendingMoves();
            }
        },
        firstColumnCards: {
            handler: 'saveToLocalStorage',
            deep: true
        },
        secondColumnCards: {
            handler: 'saveToLocalStorage',
            deep: true
        },
        thirdColumnCards: {
            handler: 'saveToLocalStorage',
            deep: true
        }
    },
    methods: {
        overdueCardsCount() {
            const now = Date.now();
            // Считаем все карточки, которые ещё не выполнены (не в третьей колонке)
            const activeCards = [...this.firstColumnCards, ...this.secondColumnCards];
            return activeCards.filter(card => card.deadline && card.deadline < now).length;
        },
        addCard(cardData) {
            if (this.firstColumnCards.length >= this.firstMax) {
                alert('Нельзя добавить новую карточку: первая колонка заполнена (максимум 3).');
                return;
            }

            const items = cardData.items.map(text => ({
                text: text,
                completed: false
            }));

            const newCard = {
                id: this.nextCardId++,
                name: cardData.name,
                items: items,
                completedAt: null,
                deadline: cardData.deadline || null,
            };

            this.firstColumnCards.push(newCard);
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

        processPendingMoves() {
            let moved;
            do {
                moved = false;

                for (let i = 0; i < this.firstColumnCards.length; i++) {
                    const card = this.firstColumnCards[i];
                    if (this.getCompletionPercent(card) > 50 && this.secondColumnCards.length < this.secondMax) {
                        this.moveCard(card, this.firstColumnCards, this.secondColumnCards);
                        moved = true;
                        break;
                    }
                }

                if (moved) continue;

                for (let i = 0; i < this.secondColumnCards.length; i++) {
                    const card = this.secondColumnCards[i];
                    if (this.getCompletionPercent(card) === 100 && !card.completedAt) {
                        card.completedAt = new Date().toLocaleString();
                        this.moveCard(card, this.secondColumnCards, this.thirdColumnCards);
                        moved = true;
                        break;
                    }
                }
            } while (moved);
        },

        handleToggleItem({cardId, itemIndex, completed}) {
            const card = this.findCardById(cardId);
            if (!card) return;
            if (this.firstColumnCards.includes(card) && this.isFirstColumnLocked) {
                return;
            }

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
            }

            if (targetColumn && targetColumn !== currentColumn) {
                this.moveCard(card, currentColumn, targetColumn);
            }

            this.processPendingMoves();
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
            this.$nextTick(() => {
                this.processPendingMoves();
            });
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

