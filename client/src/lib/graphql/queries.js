import { ApolloClient, createHttpLink, concat, gql, InMemoryCache, ApolloLink } from "@apollo/client";
// import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";


// Replaced by ApolloClient

// const client = new GraphQLClient(
// 	"http://localhost:9000/graphql",
// 	{
// 		headers: () => {
// 			const accessToken = getAccessToken();
// 			if (accessToken) {
// 				return { 'Authorization': `Bearer ${accessToken}` }
// 			}
// 			return {}
// 		}
// 	});


// ApolloClient configuration

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' })
const authLink = new ApolloLink((operation, forward) => {
	const accessToken = getAccessToken();
	if (accessToken) {
		operation.setContext({
			headers: { 'Authorization': `Bearer ${accessToken}` }
		});
	}
	return forward(operation);
})


const apolloClient = new ApolloClient({
	link: concat(authLink, httpLink),
	cache: new InMemoryCache(),
	// not used here, cache first policy by default, and changed for individual queries
	// https://www.apollographql.com/docs/react/data/queries/#supported-fetch-policies
	
	// defaultOptions: {
	// 	query: {
	// 		//to get fresh data most of the time
	// 		fetchPolicy: 'network-only',
	// 	},
	// 	//react apollo integration, to reload component if the data changes
	// 	watchQuery: {
	// 		fetchPolicy: 'network-only',
	// 	}
	// }
});

export async function getJobs() {
	const query = gql`
        query Jobs {
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

	const result = await apolloClient.query({ 
		query,
		//this policy only applies on the homepage bc getjobs is called only here
		//other pages uses cache, but here it is configured globally in the apolloClient
		//gets fresh data
		fetchPolicy: 'network-only',
	});
	return result.data.jobs;

	// Using GraphqlClient
	// const data = await client.request(query)
	// return data.jobs;
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
	const result = await apolloClient.query({
		query,
		variables: { id }
	});
	return result.data.job

	// Using GraphqlClient
	// const data = await client.request(query, { id })
	// return data.job;
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
	const result = await apolloClient.query({
		query,
		variables: { id }
	});
	return result.data.company

	// Using GraphqlClient
	// const data = await client.request(query, { id })
	// return data.company;
}


export async function createJob({ title, description }) {
	const mutation = gql`
		mutation CreateJob($input: CreateJobInput!) {
			job: createJob(input: $input) {
				id
			}
		}

	`;

	const result = await apolloClient.mutate({
		mutation,
		variables: { input: { title, description } }
	});
	return result.data.job

	// Using GraphqlClient
	// const data = await client.request(mutation, {
	// 	input: { title, description },
	// });
	// return data.job;
}