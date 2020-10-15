import apolloClient from "@/api/graphql/index"
import gql from 'graphql-tag'

export let createDialogue = function (v) {
    return apolloClient().mutate({
        mutation: gql`mutation ($ownerId: ID!, $newDialogue: InputDialogue) {
            createDialogue(ownerId: $ownerId, dialogue: $newDialogue) {
                id
                name
                owner
                ownerType
                recentlyAuthor
                type
                content
                createdAt
            }
        }`,
        variables: v
    })
}

export let getAllDialogue = function (v) {
    return apolloClient().query({
        query: gql`query ($ownerType: OwnerType!, $parentPath: String!, $ownerId: ID) {
            getAllDialogues(ownerType: $ownerType, parentPath: $parentPath, ownerId: $ownerId) {
                id
                name
                owner
                ownerType
                recentlyAuthor
                type
                parentPath
                createdAt
            }
        }`,
        variables: v
    })
}

export let getOneDialogue = function (v) {
    return apolloClient().query({
        query: gql`query ($id: ID!) {
            getOneDialogue(id: $id) {
                id
                createdAt
                updatedAt
                name
                owner
                ownerType
                recentlyAuthor
                type
                parentPath
                content
                history {
                    time
                    content
                    action
                    authorId
                }
            }
        }`,
        variables: v
    })
}

export let updateDialogueContent = function (v) {
    return apolloClient().mutate({
        mutation: gql`mutation ($id: ID!, $dialogueContent: String) {
            updateDialogueContent(id: $id, content: $dialogueContent) {
                id
                createdAt
                updatedAt
                name
                owner
                ownerType
                recentlyAuthor
                type
                parentPath
                content
                history {
                    time
                    content
                    action
                    authorId
                }
            }
        }`,
        variables: v
    })
}
