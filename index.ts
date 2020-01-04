import { of, pipe, fromEvent,  Subject} from 'rxjs'; 
import { map, concatAll } from 'rxjs/operators';
import './style.css';
let disValue = '', opearator='', previousValue = '';
let firstOperand: number, secondOperand: number;

const disSub = new Subject()
disSub.subscribe({
  next: function(){
    (document.querySelector('.display')as any).value = disValue;
  }
})

const preSub= new Subject()
preSub.subscribe({
  next: function() {
    (document.querySelector('.previous')as any).innerText = previousValue;
  }
})


const numClickObser = fromEvent(document.getElementsByClassName('num'), 'click')
const numMap = numClickObser.pipe(
  map(x => {
  const value = (x as any).target.innerHTML
   return value
  })
);
numMap.subscribe(c => {
  disValue += c;
  disSub.next()
});

const operClickObser = fromEvent(document.getElementsByClassName('oper'), 'click')
const operMap = operClickObser.pipe(
  map(x => {
    opearator = (x as any).target.innerHTML
    firstOperand = (parseFloat(disValue));
    previousValue = disValue;
  })
);
operMap.subscribe(event => {
  disValue ='';
  preSub.next()
  disSub.next()
})

const submitObser = fromEvent(document.getElementsByClassName('submit'), 'click')
const submitMap = submitObser.pipe(
  map(x => {
    secondOperand = parseFloat(disValue)
    doit(firstOperand, secondOperand, opearator)
  })
)
submitMap.subscribe()
function doit(fir: number, sec: number, oper: string) {
  let result: number = 0
  switch(oper) {
    case '+':
      result = fir+sec;
      break
    case '-':
      result = fir-sec;
      break
    case '*':
      result = fir*sec;
      break
    case '/':
      result = fir/sec;
      break
    case '%':
      result = fir%sec;
      break
  }
  disValue = result+'';  
  previousValue ='';
  preSub.next()
  disSub.next()
}
const clearObser = fromEvent(document.querySelector(".clear"), 'click')
clearObser.subscribe(x => {
  disValue = ''
  previousValue = ''
  preSub.next()
  disSub.next()
})