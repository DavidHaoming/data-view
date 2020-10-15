import gql from 'graphql-tag'
import apolloClient from "@/api/graphql/index"

export let getUserInfo = function () {
    return apolloClient.query({
        query: gql`query {
            getLoginUser {
                id
                name
                avatar
                type
                status
                createdAt
            }
        }`
    })
}

export let getUserAdminOrganization = function () {
    return apolloClient.query({
        query: gql`query {
            getAllOrganizations {
                id
                name
                sign
                type
                admin
                creator
                avatar
                level
                createdAt
            }
        }`
    })
}

export let createOrganization = function (v) {
    return apolloClient.mutate({
        mutation: gql`mutation ($newOrg: InputOrganization) {
            createOrganization(organization: $newOrg) {
                id
                name
                sign
                type
                admin
                creator
                avatar
                level
                createdAt
            }
        }`,
        variables: v
    })
}

