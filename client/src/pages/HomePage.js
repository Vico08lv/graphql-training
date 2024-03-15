import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import { getJobs } from '../lib/graphql/queries';

// getJobs().then((jobs) => console.log(jobs))


function HomePage() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(setJobs)
  }, [])

  // console.log('[HomePage] jobs:', jobs)
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
