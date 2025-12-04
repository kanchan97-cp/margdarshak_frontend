import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('stories');
  const [stories, setStories] = useState([]);
  const [colleges, setColleges] = useState([]);

  // Form States
  const [storyForm, setStoryForm] = useState({ name: '', role: '', quote: '' });
  const [collegeForm, setCollegeForm] = useState({ name: '', location: '', courses: '', ranking: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStories();
    fetchColleges();
  }, []);

  const fetchStories = () => API.get('/stories').then(res => setStories(res.data.data));
  const fetchColleges = () => API.get('/colleges').then(res => setColleges(res.data.data));

  // Story Handlers
  const handleStorySubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      API.put(`/stories/${editingId}`, storyForm).then(() => {
        fetchStories();
        resetStoryForm();
      });
    } else {
      API.post('/stories', storyForm).then(() => {
        fetchStories();
        resetStoryForm();
      });
    }
  };

  const deleteStory = (id) => {
    if (window.confirm('Delete this story?')) {
      API.delete(`/stories/${id}`).then(fetchStories);
    }
  };

  const editStory = (story) => {
    setStoryForm({ name: story.name, role: story.role, quote: story.quote });
    setEditingId(story._id);
    setActiveTab('stories');
  };

  const resetStoryForm = () => {
    setStoryForm({ name: '', role: '', quote: '' });
    setEditingId(null);
  };

  // College Handlers
  const handleCollegeSubmit = (e) => {
    e.preventDefault();
    const payload = { ...collegeForm, courses: collegeForm.courses.split(',').map(c => c.trim()) };
    if (editingId) {
      API.put(`/colleges/${editingId}`, payload).then(() => {
        fetchColleges();
        resetCollegeForm();
      });
    } else {
      API.post('/colleges', payload).then(() => {
        fetchColleges();
        resetCollegeForm();
      });
    }
  };

  const deleteCollege = (id) => {
    if (window.confirm('Delete this college?')) {
      API.delete(`/colleges/${id}`).then(fetchColleges);
    }
  };

  const editCollege = (college) => {
    setCollegeForm({
      name: college.name,
      location: college.location,
      courses: college.courses.join(', '),
      ranking: college.ranking
    });
    setEditingId(college._id);
    setActiveTab('colleges');
  };

  const resetCollegeForm = () => {
    setCollegeForm({ name: '', location: '', courses: '', ranking: '' });
    setEditingId(null);
  };

  return (
    <div className="section">
      <h2>Admin Panel</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button className={`btn ${activeTab === 'stories' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('stories')} style={{ marginRight: '10px' }}>Manage Stories</button>
        <button className={`btn ${activeTab === 'colleges' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('colleges')}>Manage Colleges</button>
      </div>

      {activeTab === 'stories' && (
        <div>
          <h3>{editingId ? 'Edit Story' : 'Add Story'}</h3>
          <form onSubmit={handleStorySubmit} className="card" style={{ maxWidth: '500px' }}>
            <input className="input" placeholder="Name" value={storyForm.name} onChange={e => setStoryForm({ ...storyForm, name: e.target.value })} required />
            <input className="input" placeholder="Role" value={storyForm.role} onChange={e => setStoryForm({ ...storyForm, role: e.target.value })} required />
            <textarea className="input" placeholder="Quote" value={storyForm.quote} onChange={e => setStoryForm({ ...storyForm, quote: e.target.value })} required />
            <button className="btn" type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button className="btn btn-secondary" type="button" onClick={resetStoryForm} style={{ marginLeft: '10px' }}>Cancel</button>}
          </form>

          <div className="grid mt-2">
            {stories.map(story => (
              <div key={story._id} className="card">
                <h4>{story.name}</h4>
                <p>{story.role}</p>
                <button className="btn" onClick={() => editStory(story)} style={{ marginRight: '5px' }}>Edit</button>
                <button className="btn btn-secondary" onClick={() => deleteStory(story._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'colleges' && (
        <div>
          <h3>{editingId ? 'Edit College' : 'Add College'}</h3>
          <form onSubmit={handleCollegeSubmit} className="card" style={{ maxWidth: '500px' }}>
            <input className="input" placeholder="Name" value={collegeForm.name} onChange={e => setCollegeForm({ ...collegeForm, name: e.target.value })} required />
            <input className="input" placeholder="Location" value={collegeForm.location} onChange={e => setCollegeForm({ ...collegeForm, location: e.target.value })} required />
            <input className="input" placeholder="Courses (comma separated)" value={collegeForm.courses} onChange={e => setCollegeForm({ ...collegeForm, courses: e.target.value })} required />
            <input className="input" type="number" placeholder="Ranking" value={collegeForm.ranking} onChange={e => setCollegeForm({ ...collegeForm, ranking: e.target.value })} required />
            <button className="btn" type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button className="btn btn-secondary" type="button" onClick={resetCollegeForm} style={{ marginLeft: '10px' }}>Cancel</button>}
          </form>

          <div className="grid mt-2">
            {colleges.map(college => (
              <div key={college._id} className="card">
                <h4>{college.name}</h4>
                <p>{college.location} (Rank: {college.ranking})</p>
                <button className="btn" onClick={() => editCollege(college)} style={{ marginRight: '5px' }}>Edit</button>
                <button className="btn btn-secondary" onClick={() => deleteCollege(college._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;