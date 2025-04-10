import { useState, useEffect } from 'react';
import './App.css';
import ClipLoader from "react-spinners/ClipLoader";

function SearchBar() {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users`);
        if (!response.ok) throw new Error('Error with fetch');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      } 
    };
    fetchData();
  }, []);

  // Fetch details for a single user
  const fetchOne = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error('Error with fetch');
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error(error);
    } 
  };

  // Handle input change and trigger search
  const handleSearch = () => {
    if (text.trim() === '') {
      alert('Search bar is empty');
      return;
    }

    const filtered = data.filter((user) =>
      user.login.toLowerCase().includes(text.toLowerCase())
    );

    if (filtered.length === 1) {
      fetchOne(filtered[0].login);
    }
  };

  // Filtered list of users
  const filteredData = data
    .filter((user) => user.login.toLowerCase().includes(text.toLowerCase()))
    .map((user) => (
      <div key={user.id} style={{ marginBottom: '10px' }}>
        <img src={user.avatar_url} alt="avatar" style={{ width: '250px' }} />
        <h4 onClick={() => fetchOne(user.login)} style={{ cursor: 'pointer' }}>
          {user.login}
        </h4>
      </div>
    ));

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <ClipLoader color="#3498db" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        alignItems: 'center',
        border: '1px solid',
        padding: '20px',
        margin: 'auto',
        marginTop: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '20px',
        }}
      >
        <h1>Microsoft Proj</h1>
        <div>
          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            style={{ border: '1px solid black', padding: '5px' }}
          />
          <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
            Search
          </button>
        </div>
      </div>
      <div>
       
      {userDetails ? (
        <div>
           <i className="fas fa-coffee"></i>
          <img
            src={userDetails.avatar_url}
            alt="avatar"
            style={{ width: '400px' }}
          />
          <h2>Name: {userDetails.name}</h2>
          <p>Bio: {userDetails.bio || 'None'}</p>
          <p>Followers: {userDetails.followers}</p>
          <p>Following: {userDetails.following}</p>
          <p>Location: {userDetails.location || 'Not specified'}</p>
          <a
            href={userDetails.repos_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Repositories
          </a>
        </div>
      ) : filteredData.length === 0 ? (
        <p>Record not found</p>
      ) : (
        filteredData
      )}
    </div>
    </div>
  );
}

export default SearchBar;
