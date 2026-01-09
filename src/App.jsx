import React, { useState } from 'react';

function App() {
const [name, setName] = useState("");

  function display(){

   fetch('http://127.0.0.1:8000/api/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
            'Accept': 'application/json' // 🔥 THIS LINE IS IMPORTANT
      },
      body: JSON.stringify({
        name: name
      })
    })
    .then(res => res.json()) // ✅ parse JSON here
.then(data => console.log(data))
.catch(err => console.error(err));

  }

  return (
   <>
   <input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
<br/><br/>
<button onClick={display}>Add</button>

   </>
  );
}

export default App;
