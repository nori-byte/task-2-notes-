Vue.component('first-column', {
    props: {
        cards: Array,
        max: Number
    },
    template: `
    <div>
        <h2>First Column</h2>
    </div>
    `
})
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
    <div></div>
    `
})
let app = new Vue({
    el: '#app',
    data: {
        firstColumnCards: [],
        secondColumnCards: [],
        thirdColumnCards: []
    }
})