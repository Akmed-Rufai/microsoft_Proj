import { useState, useEffect, lazy, Suspense  } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './App.css';

const ClipLoader = lazy(() => import('react-spinners/ClipLoader'));
const ReactPaginate = lazy(() => import('react-paginate'));

function SearchBar() {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const userPerPage = 6;
  const pageVisited = pageNumber * userPerPage
  const pageCount = Math.ceil(data.length / userPerPage)



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
      } finally {
        setLoading(false);
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
    } finally {
      setLoading(false);
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
  const filteredData = data.slice(pageVisited, pageVisited + userPerPage)
    .filter((user) => user.login.toLowerCase().includes(text.toLowerCase()))
    .map((user) => (
      <div key={user.id} className='bg-gray-50 '>
      <LazyLoadImage
        alt="avatar"
        src={user.avatar_url}
        width={270}
        effect="blur"
        className="mx-auto shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      />
        <h4 onClick={() => fetchOne(user.login)} className= "cursor-pointer text-blue-600 hover:underline">
          {user.login}
        </h4>
      </div>
    ));

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
      <Suspense fallback={<ClipLoader/>}>
       <ClipLoader color="#3498db" loading={loading} size={50} />
      </Suspense>
      </div>
    );
  }

  const changePage = ({selected})=>{
    setPageNumber(selected)
  }

  return (
    <div className="flex flex-col w-full mx-auto items-center">
      <div className="flex justify-around w-full items-center py-5 
      sticky top-0 z-20 shadow-sm bg-gray-300"> 
        <h3 className="text-lg font-semibold text-blue-800">Github search</h3>
        <div>
          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            className="border border-black px-2 py-1 rounded"
          />
          <button onClick={handleSearch}
          className="ml-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>
      {userDetails ? (
        <div className='py-5'>
          <i  
          className="fas fa-arrow-left fa-2x absolute top-[90px] left-[100px] cursor-pointer text-gray-700"
          onClick={() => setUserDetails(null)}
          ></i>
         <LazyLoadImage
          alt="avatar"
          src={userDetails.avatar_url}
          width={450}
          effect="blur"
          className="mx-auto shadow-xs"
        />
          <h2><scan className="font-semibold">Name:</scan>{userDetails.name}</h2>
          <p><scan className="font-semibold">Bio:</scan> {userDetails.bio || 'None'}</p>
          <p><scan className="font-semibold">Followers:</scan> {userDetails.followers}</p>
          <p><scan className="font-semibold">Following:</scan> {userDetails.following}</p>
          <p><scan className="font-semibold">Location:</scan> {userDetails.location || 'Not specified'}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-2/4 p-10 border-gray-300">
          {filteredData}
        </div>
      )}
   {!userDetails && (
     <Suspense fallback={<div>Loading pagination...</div>}>
       <ReactPaginate
         previousLabel="Previous"
         nextLabel="Next"
         pageCount={pageCount}
         onPageChange={changePage}
         containerClassName="flex justify-center items-center mt-6 gap-2 cursor-pointer flex-wrap"
         pageClassName="page-item"
         pageLinkClassName="px-4 py-2 border rounded hover:bg-gray-200 transition h-full flex items-center justify-center"
         previousClassName="page-item"
         previousLinkClassName="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
         nextClassName="page-item"
         nextLinkClassName="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
         activeClassName="bg-blue-500 text-green h-full rounded"
         disabledClassName="opacity-50 cursor-not-allowed"
       />
     </Suspense>
 
  )}
    </div>
  );
}

export default SearchBar;
