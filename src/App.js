import './style.css';
import {useState, useEffect} from 'react';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import { useStopwatch } from 'react-timer-hook';

export default function App() {
  const [numbers, setNumbers] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [fisrtTurn, setFirstTurn] = useState(true);
  const [score, setScore] = useState(
    () =>
      JSON.parse(localStorage.getItem('score')) || {
        roll: null,
        time: '',
        firstTime: true,
      }
  );

  useEffect(() => {
    const allHeld = numbers.every((item) => item.isHeld);
    const firstValue = numbers[0].value;
    const allSameValue = numbers.every((item) => item.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      pause();
      if (score.firstTime) {
        setScore({
          roll: rolls,
          time: `${hours}:${minutes}:${seconds}`,
          firstTime: false,
        });
      } else if (score.roll > rolls) {
        setScore((prevScore) => {
          return {
            ...prevScore,
            roll: rolls,
            time: `${hours}:${minutes}:${seconds}`,
          };
        });
      } else {
        setScore((prevScore) => ({ ...prevScore }));
      }
    }
  }, [numbers]);

  useEffect(() => {
    if (tenzies) {
      localStorage.setItem('score', JSON.stringify(score));
    }
  }, [tenzies]);

  function allNewDice() {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      let num;
      num = {
        value: Math.floor(Math.random() * 6) + 1,
        isHeld: false,
        id: nanoid(),
      };
      arr.push(num);
    }
    return arr;
  }

  function holdDice(id) {
    setNumbers((prevDice) => {
      return prevDice.map((item) => {
        return { ...item, isHeld: id === item.id ? !item.isHeld : item.isHeld };
      });
    });
    if (fisrtTurn) {
      reset();
    }
    setFirstTurn(false);
  }

  function roll() {
    if (tenzies) {
      setTenzies(false);
      setNumbers(allNewDice());
      setRolls(0);
      setFirstTurn(true);
      reset();
      pause();
    } else {
      setNumbers((prevDice) => {
        return prevDice.map((item) => {
          return item.isHeld === false
            ? {
                value: Math.floor(Math.random() * 6) + 1,
                isHeld: false,
                id: nanoid(),
              }
            : item;
        });
      });
      setRolls((rolls) => rolls + 1);
    }
  }

  const newArr = numbers.map((item) => {
    return (
      <Die
        key={item.id}
        value={item.value}
        isHeld={item.isHeld}
        click={() => holdDice(item.id)}
      />
    );
  });

  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  return (
    <main>
      {tenzies && <Confetti />}
      <div className="container">
        <div className="high-score">
          <p>Personal best score</p>
          {score.roll ? (
            <p>
              Roll:{score.roll} - Time:{score.time}
            </p>
          ) : (
            'play frst time'
          )}
        </div>
        <div className="text">
          <p className="title">Tenzies</p>
          <p className="instruction">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
        </div>
        <div className="dies">{newArr}</div>
        <button onClick={roll}>{tenzies ? 'New Game' : 'Roll'}</button>
        <div className="score">
          <p>{rolls}</p>
          <p>
            <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
