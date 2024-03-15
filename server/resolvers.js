import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";
import { getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob } from "./db/jobs.js";

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: async (_root, { id }) => {
            const job = await getJob(id)
            if(!job) {
                throw notFoundError('No Job found with id ' + id)
            }
            return job
        },
        company: async (_root, { id }) => { 
            const company = await getCompany(id)
            if(!company) {
                throw notFoundError('No Company found with id ' + id)
            }
            return company
        }
    },

    Mutation: {
        // title & description are destructured from the input
        createJob: (_root, { input: { title, description }}, { user }) => {
            if(!user) {
                throw unauthorizedError('Missing authentication')
            }
            return createJob({ companyId: user.companyId, title, description })
        },

        deleteJob: async (_root, { id }, { user }) => {
            if(!user) {
                throw unauthorizedError('Missing authentication')
            }
            const job = await deleteJob(id, user.companyId)
            if(!job){
                throw notFoundError('No Job found with id ' + id)
            }
            return job
        },

        updateJob: async (_root, {input: { id, title, description }}, { user }) => {
            if(!user) {
                throw unauthorizedError('Missing authentication')
            }
            const job = updateJob({ id, companyId: user.companyId, title, description })
            if(!job) {
                throw notFoundError('No Job found with id ' + id)
            }
            return job
        }
    },

    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId)
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    }

}

function toIsoDate(date) {
    return date.slice(0, 'yyyy-mm-dd'.length)
}


function notFoundError(message)  {
    return new GraphQLError(message,{
        extensions: { code: 'NOT_FOUND'}
    })
}

function unauthorizedError(message)  {
    return new GraphQLError(message,{
        extensions: { code: 'UNAUTHORIZED'}
    })
}