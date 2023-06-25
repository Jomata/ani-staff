/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query AnimeSearchByName($query: String!, $amount: Int!) {\n    Page(page: 1, perPage: $amount) {\n      media(search: $query, type: ANIME, sort: POPULARITY_DESC) {\n        id\n        siteUrl\n        bannerImage\n        coverImage {\n          medium\n        }\n        title {\n          romaji\n          english\n          native\n          userPreferred\n        }\n      }\n    }\n  }\n": types.AnimeSearchByNameDocument,
    "\n  query AnimeStaffById($id: Int!, $staffPage: Int!) {\n    Media(id: $id) {\n      staff(page: $staffPage, sort: RELEVANCE) {\n        pageInfo {\n          currentPage\n          lastPage\n        }\n        edges {\n          id #id of the connection\n          role\n          node {\n            id #id of the actual staff\n            siteUrl\n            name {\n              userPreferred\n            }\n            image {\n              medium\n            }\n          }\n        }\n      }\n    }\n  }\n": types.AnimeStaffByIdDocument,
    "\n  query StaffRolesByIds($staffIds: [Int!], $staffPage: Int = 1) {\n    Page {\n      staff(id_in: $staffIds) {\n        id\n        name {\n          userPreferred\n        }\n        staffMedia(page: $staffPage, type: ANIME, sort: POPULARITY_DESC) {\n          edges {\n            id\n            staffRole\n            node {\n              id\n              popularity\n              siteUrl\n              bannerImage\n              coverImage {\n                medium\n              }\n              title {\n                userPreferred\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.StaffRolesByIdsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AnimeSearchByName($query: String!, $amount: Int!) {\n    Page(page: 1, perPage: $amount) {\n      media(search: $query, type: ANIME, sort: POPULARITY_DESC) {\n        id\n        siteUrl\n        bannerImage\n        coverImage {\n          medium\n        }\n        title {\n          romaji\n          english\n          native\n          userPreferred\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AnimeSearchByName($query: String!, $amount: Int!) {\n    Page(page: 1, perPage: $amount) {\n      media(search: $query, type: ANIME, sort: POPULARITY_DESC) {\n        id\n        siteUrl\n        bannerImage\n        coverImage {\n          medium\n        }\n        title {\n          romaji\n          english\n          native\n          userPreferred\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AnimeStaffById($id: Int!, $staffPage: Int!) {\n    Media(id: $id) {\n      staff(page: $staffPage, sort: RELEVANCE) {\n        pageInfo {\n          currentPage\n          lastPage\n        }\n        edges {\n          id #id of the connection\n          role\n          node {\n            id #id of the actual staff\n            siteUrl\n            name {\n              userPreferred\n            }\n            image {\n              medium\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AnimeStaffById($id: Int!, $staffPage: Int!) {\n    Media(id: $id) {\n      staff(page: $staffPage, sort: RELEVANCE) {\n        pageInfo {\n          currentPage\n          lastPage\n        }\n        edges {\n          id #id of the connection\n          role\n          node {\n            id #id of the actual staff\n            siteUrl\n            name {\n              userPreferred\n            }\n            image {\n              medium\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query StaffRolesByIds($staffIds: [Int!], $staffPage: Int = 1) {\n    Page {\n      staff(id_in: $staffIds) {\n        id\n        name {\n          userPreferred\n        }\n        staffMedia(page: $staffPage, type: ANIME, sort: POPULARITY_DESC) {\n          edges {\n            id\n            staffRole\n            node {\n              id\n              popularity\n              siteUrl\n              bannerImage\n              coverImage {\n                medium\n              }\n              title {\n                userPreferred\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query StaffRolesByIds($staffIds: [Int!], $staffPage: Int = 1) {\n    Page {\n      staff(id_in: $staffIds) {\n        id\n        name {\n          userPreferred\n        }\n        staffMedia(page: $staffPage, type: ANIME, sort: POPULARITY_DESC) {\n          edges {\n            id\n            staffRole\n            node {\n              id\n              popularity\n              siteUrl\n              bannerImage\n              coverImage {\n                medium\n              }\n              title {\n                userPreferred\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;