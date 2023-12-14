import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [datemp, setDatemp] = useState('');
  const [title, setTitle] = useState('');
  const [descript, setDescript] = useState('');
  const [selectedDate, setSelectedDate] = useState();
  const [selectedDateData, setSelectedDateData] = useState({});

  const val = useRef('');
  const val2 = useRef('');
  const obj = () => {
    const newItem = {
      title: title,
      descript: descript,
      day: getDayName(datemp),
    };   
    
    setSelectedDateData((prevData) => ({
      ...prevData,
      [datemp]: [...(prevData[datemp] || []), newItem],
    }));
    
    setTitle("");
    setDescript("");

  };
  useEffect(() => {
    const data = localStorage.getItem('Data');
    setSelectedDateData(data ? JSON.parse(data) : {});
  }, []);

  useEffect(() => {
    localStorage.setItem('Data', JSON.stringify(selectedDateData));
  }, [selectedDateData]);

  const getDayName = (dateString) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const d = new Date(dateString);
    const dayName = days[d.getDay()];
    return dayName;
  };

  const titleset = () => {
    setTitle(val.current.value);
  };

  const descset = () => {
    setDescript(val2.current.value);
  };

  const datea = (e) => {
    const selectedDate = e.target.value;
    setDatemp(selectedDate);
    setSelectedDate(selectedDate);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, hoverIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text/plain');
    const updatedData = [...selectedDateData[selectedDate]];
    const [draggedItem] = updatedData.splice(draggedIndex, 1);
    updatedData.splice(hoverIndex, 0, draggedItem);
    
    setSelectedDateData((prevData) => ({
      ...prevData,
      [selectedDate]: updatedData,
    }));
  };
function deleteObject(data){
  setSelectedDateData((prevData) => {
    const updatedData = {
      ...prevData,
      [selectedDate]: prevData[selectedDate]?.filter((dat) => dat.title !== data.title),
    };
    if (updatedData[selectedDate]?.length === 0) {
      delete updatedData[selectedDate];
    }
  
    return updatedData;
  });
  
}
  return (
    <div className="App">
      <div className="main">
        <div className="tit">
          <input
            className="t"
            ref={val}
            onChange={titleset}
            type="text"
            value={title}
            placeholder="Title"
          />
          <input
            min={new Date().toISOString().split('T')[0]}
            className="b"
            type="date"
            onChange={(e) => datea(e)}
          />
        </div>
        <div className="tit">
          <input
            className="t"
            type="text"
            ref={val2}
            onChange={descset}
            value={descript}
            placeholder="Description"
          />
          <button className="b" onClick={() => obj()}>
            Save
          </button>
        </div>
      </div>

      <div className="days">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <h1
            key={day}
            className={
              selectedDate && getDayName(selectedDate) === day
                ? 'highlighted'
                : 'box'
            }
          >
            {day}
          </h1>
        ))}
      </div>
      <div>
        {selectedDateData[selectedDate]?.map((each, index) => (
          <div
            key={index}
            className="descrop"
            draggable
            onDragStart={(event) => handleDragStart(event, index)}
            onDragOver={(event) => handleDragOver(event)}
            onDrop={(event) => handleDrop(event, index)}
          >
            <div className="endc">
              <h1>{each.title}</h1>
              <p>{each.descript}</p>
            </div>
            <div onClick={()=>deleteObject(each)}>
              <button className="btn">delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
