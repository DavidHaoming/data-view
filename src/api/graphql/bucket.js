import apolloClient from "@/api/graphql/index"
import gql from 'graphql-tag'

export let createBucket = function (v) {
    return apolloClient.mutate({
        mutation: gql`mutation ($ownerId: ID!, $newBucket: InputBucket){
            createBucket(ownerId: $ownerId, bucket: $newBucket) {
                id
                name
                owner
                ownerType
                dialogues {
                    id
                }
                createdAt
            }
        }`,
        variables: v
    })
}
