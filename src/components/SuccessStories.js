import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStories(page);
  }, [page]);

  const fetchStories = (pageNum) => {
    let query = `/stories?page=${pageNum}&limit=3`;

    API.get(query)
      .then(res => {
        setStories(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="section" style={{ background: '#f8f9fa' }}>
      <h2 className="text-center mb-2">Success Stories</h2>
      <div className="grid">
        {stories.map((story) => (
          <div key={story._id} className="card">
            <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{story.quote}"</p>
            <h4>{story.name}</h4>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Now a {story.role}</p>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="text-center mt-2">
          <button
            className="btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{ marginRight: '10px' }}
          >
            Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{ marginLeft: '10px' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default SuccessStories;