import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { url_base } from '../config';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ year: '', department: '', mostActive: false });
  const [page, setPage] = useState(1);
  const studentsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${url_base}/api/fetch_students_data`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setFiltered(data);
      })
      .catch(err => console.error('Failed to load students:', err));
  }, []);

  useEffect(() => {
    let temp = [...students];

    // Search filter
    if (search) {
      temp = temp.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.registration_number.includes(search)
      );
    }

    // Dropdown filters
    if (filters.year) temp = temp.filter((s) => s.year === parseInt(filters.year));
    if (filters.department) temp = temp.filter((s) => s.department === filters.department);
    if (filters.mostActive) temp = temp.sort((a, b) => b.events_attended - a.events_attended);

    setFiltered(temp);
    setPage(1); // Reset page on filter change
  }, [search, filters, students]);

  const paginatedStudents = filtered.slice((page - 1) * studentsPerPage, page * studentsPerPage);

  return (
    <div className="container py-4 text-white bg-dark min-vh-100 position-relative">
      <h4 className="text-danger mb-3">Student Management</h4>

      {/* Filters */}
      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or reg. no"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="">All Years</option>
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="">All Departments</option>
            {[...new Set(students.map((s) => s.department))].map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-outline-light w-100"
            onClick={() => setFilters({ ...filters, mostActive: !filters.mostActive })}
          >
            {filters.mostActive ? 'Remove Activity Sort' : 'Most Events Attended'}
          </button>
        </div>
      </div>

      {/* Student List */}
        <div className="list-group">
        {paginatedStudents.map((student) => (
            <div
            key={student.registration_number}
            className="list-group-item bg-dark text-white mb-3 rounded border border-secondary shadow-sm"
            role="button"
            onClick={() => navigate('/student-edit', {
                state: { registration_number: student.registration_number }
            })}
            >
            <h6 className="mb-1">{student.name}</h6>
            <p className="mb-1 text-light">
                Reg No: {student.registration_number} | Dept: {student.department} | Year: {student.year}
            </p>
            <small className="text-info">Events Attended: {student.events_attended}</small>
            </div>
        ))}
        </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-light"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="text-muted">Page {page}</span>
        <button
          className="btn btn-outline-light"
          disabled={page * studentsPerPage >= filtered.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Floating Add Button */}
      <button
        className="btn btn-danger rounded-circle position-fixed"
        style={{ bottom: '30px', right: '30px', width: '60px', height: '60px', fontSize: '24px' }}
        title="Add Students"
        onClick={() => navigate('/student-upload')}
      >
        +
      </button>
    </div>
  );
};

export default StudentManagement;
