import { GraphQLServer } from 'graphql-yoga'
import fs from 'fs'

const users = JSON.parse(fs.readFileSync('./datas/users.json').toString())
const posts = JSON.parse(fs.readFileSync('./datas/posts.json').toString())
const comments = JSON.parse(fs.readFileSync('./datas/comments.json').toString())

const typeDefs = `
    type Query{
        user(userId: Int!): User!
        users: [User!]
        posts: [Post!]
        post(postId: Int): Post!
    }
    
    # -------------- Post typedef -------------- #
    type Post{
        id: ID!
        title: String!
        body: String!
        author: User!
        comments: [Comment!]!
    }

    # -------------- Comment typedef -------------- #
    type Comment{
        id: ID!
        body: String!
        post: Post!
        author: User!
    }


    # -------------- User typedef -------------- #
    type User{
        id: ID!
        name: String!
        username: String!
        email: String!
        address: Address,
        phone: String!
        website: String!
        company: Company!
        posts: [Post!]!
    }
    type Company{
        name: String!
        catchPhrase: String!
        bs: String!
    }
    type Address{
        street: String!
        suite: String!
        city: String!
        zipcode: String!
        geo: Geo!
    }
    type Geo{
        lat: Float!
        lng: Float!
    }
`
const resolvers = {
    Query: {
        user(parent, args) {
            return users.find(user => user.id === args.userId)
        },
        users() {
            return users
        },
        posts() {
            return posts
        },
        post(parent, args) {
            if (args.postId) return posts.find(post => post.id === args.postId)
            return posts
        },
    },
    Post: {
        author(parent) {
            return users.find(user => user.id === parent.userId)
        },
        comments(parent) {
            return comments.filter(comment => comment.postId === parent.id)
        },
    },
    User: {
        posts(parent) {
            return posts.filter(post => post.userId === parent.id)
        },
    },

    Comment: {
        post(parent) {
            return posts.find(post => post.id === parent.postId)
        },
        author(parent) {
            const postId = parent.postId
            const post = posts.find(post => post.id === postId)
            const userId = post.userId
            const user = users.find(user => user.id === userId)
            return user
        },
    },
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() =>
    console.log('Grapgql server working at http://localhost:4000')
)
