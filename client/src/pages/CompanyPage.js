import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { getCompanyById } from '../lib/graphql/queries';
import JobList from '../components/JobList';


function CompanyPage() {

  const { companyId } = useParams();
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    (async () => {
      try{
        const company = await getCompanyById(companyId)
        setState({ company, loading: false, error: false })
      }
      catch(error) {

        // try to display the errors on client page
        // console.log(error)
        // error.forEach( e => {
        //   console.log(JSON.stringify(e.extensions.code, null, 2))
        // });
        setState({ company: null, loading: false, error: true })
      }
    })()
  }, [companyId])

  const { company, loading, error } = state

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className='has-text-danger'>An error occured</div>
  }

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className='title is-5'> Jobs at {company.name} </h2>
      <JobList jobs={company.jobs}/>
    </div>
  );
}

export default CompanyPage;
