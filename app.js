const app = new Vue({
    el: '#app',
    data: {
            round: 0,
            sequence:[],
            sequenceToGuess:[],
            userSequence:[],
            level:'easy',
            speed:{
                easy: 1500,
                normal: 1000,
                hard: 400
            },
            topLeft: false,
            topRigth: false,
            bottomLeft: false,
            bottomRight: false,
            buttons: ["topLeft", "topRigth", "bottomLeft", "bottomRight"],
            canClick: false,
            lose: false,
            sounds:{
                topLeft: '1.mp3',
                topRigth: '2.mp3',
                bottomLeft: '3.mp3',
                bottomRight: '4.mp3'
            }
    },
    methods: {
        // Получить случайную кнопку 
        getRandButton(){
           return this.buttons[parseInt(Math.random()*this.buttons.length)];
        },
        // Генерируем последовательность случайных кнопок
        getSequence(){
                let elem = this.getRandButton();
                this.sequence.push(elem);
                return this.sequence;
        },
        // Подсвечивание активной кнопки+мелодия
        flash(btn,time){
            return new Promise((resolve,reject) =>{
            this[btn] = true;
            setTimeout(() => {
                this[btn] = false;
                setTimeout(()=> resolve(),150);
            }, this.speed[this.level]);
            
            })
        },
        // Подсвечивание последовательности кнопок
        async flashSeq(){
            for(item of this.sequence){
                let audio = new Audio(`/simon-music-game/sounds/${this.sounds[item]}`);
                audio.play();
                await this.flash(item,this.speed[this.level]);
            }
        },
        // Проверяем, правильно ли нажата кнопка
        btnClicked(btn){
            
            if(this.canClick){
                let audio = new Audio(`/simon-music-game/sounds/${this.sounds[btn]}`);
                audio.play();
                let expectedBtn = this.sequenceToGuess.shift();
                if (expectedBtn === btn){
                    if(this.sequenceToGuess.length === 0){
                        setTimeout(() => this.startGame(), 600);
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

vue.config.devtools = true;