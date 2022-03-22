const app = new Vue({
    el: '#app',
    data: {
            round: 0,
            sequence:[],
            sequenceToGuess:[],
            userSequence:[],
            level:'easy',
            topLeft: false,
            topRigth: false,
            bottomLeft: false,
            bottomRight: false,
            buttons: ["topLeft", "topRigth", "bottomLeft", "bottomRight"],
            canClick: false,
            lose: false
    },
    methods: {
        // Получить случайную кнопку 
        getRandButton(){
           return this.buttons[parseInt(Math.random()*this.buttons.length)];
        },
        // Генерируем последовательность случайных кнопок
        getSequence(){
                let elem = this.getRandButton();
                console.log(elem);
                this.sequence.push(elem);
                return this.sequence;
        },
        // Подсвечивание активной кнопки+мелодия
        flash(btn,time){
            return new Promise((resolve,reject) =>{
            this[btn] = true;
            setTimeout(() => {
                this[btn] = false;
                setTimeout(()=> resolve(),250);
            }, time);
            
            })
        },
        // Подсвечивание последовательности кнопок
        async flashSeq(){
            let time = 0;
            if(this.level==='easy'){
                time = 1500;
            } else if(this.level==='normal'){
                time = 1000;
            } else if(this.level==='hard'){
                time = 500;
            }
            for(item of this.sequence){
                await this.flash(item,time);
            }
        },
        // Проверяем, правильно ли нажата кнопка
        btnClicked(btn){
            if(this.canClick){
                // console.log(btn);
                let expectedBtn = this.sequenceToGuess.shift();
                if (expectedBtn === btn){
                    if(this.sequenceToGuess.length === 0){
                        setTimeout(() => this.startGame(),600);
                    } 
                } else {
                    this.lose = true;
                }
            }
        },
        async startGame(){
            this.round++;
            this.canClick = false;
            this.getSequence();
            this.sequenceToGuess = [...this.sequence];
            await this.flashSeq();
            this.canClick = true;

        }
    }
})