import { GraphQLClient, gql } from "graphql-request";
import { getAccessToken } from "../auth";

const client = new GraphQLClient(
	"http://localhost:9000/graphql",
	{
		headers: () => {
			const accessToken = getAccessToken();
			if (accessToken) {
				return { 'Authorization': `Bearer ${accessToken}` }
			}
			return {}
		}
	}); 

export async function getJobs() {
	const query = gql`
        query  {
            jobs {
            	id
                date
                title
                company {
                    name
                    id
                }
            }
        }
    `;
	const data = await client.request(query)
	return data.jobs;
}

export async function getJobById(id) {
	const query = gql`
        query JobById($id: ID!) {
			job(id: $id) {
				id
				date
				title
				description
				company {
					id
					name
					description
				}
			}
		}
    `;
	const data = await client.request(query, { id })
	return data.job;
}

export async function getCompanyById(id) {
	const query = gql`
        query CompanyById($id: ID!) {
			company(id: $id) {
				id
				name
				description
				jobs {
					id
					date
					title
				}
			}
		}
    `;
	const data = await client.request(query, { id })
	return data.company;
}


export async function createJob({ title, description }) {
	const mutation = gql`
		mutation CreateJob($input: CreateJobInput!) {
			job: createJob(input: $input) {
				id
			}
		}

	`;
	const data = await client.request(mutation, {
		input: { title, description },
	});
	return data.job;
}