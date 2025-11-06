import type { GraphQLClient } from "graphql-request";
import type { RequestInit } from "graphql-request/dist/types.dom";
import {
  useQuery,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };

function fetcher<TData, TVariables extends { [key: string]: any }>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  requestHeaders?: RequestInit["headers"],
) {
  return async (): Promise<TData> =>
    client.request({
      document: query,
      variables,
      requestHeaders,
    });
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: string; output: string };
  FancyArticleContentDynamicZoneInput: {
    input: Record<string, any>;
    output: Record<string, any>;
  };
  I18NLocaleCode: { input: string; output: string };
  JSON: { input: Record<string, any>; output: Record<string, any> };
  TransportArticleContentDynamicZoneInput: {
    input: Record<string, any>;
    output: Record<string, any>;
  };
};

export type Article = {
  __typename?: "Article";
  content: Scalars["String"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentId: Scalars["ID"]["output"];
  excerpt: Scalars["String"]["output"];
  featureImage?: Maybe<UploadFile>;
  locale?: Maybe<Scalars["String"]["output"]>;
  localizations: Array<Maybe<Article>>;
  localizations_connection?: Maybe<ArticleRelationResponseCollection>;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ArticleLocalizationsArgs = {
  filters?: InputMaybe<ArticleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ArticleLocalizations_ConnectionArgs = {
  filters?: InputMaybe<ArticleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ArticleEntityResponseCollection = {
  __typename?: "ArticleEntityResponseCollection";
  nodes: Array<Article>;
  pageInfo: Pagination;
};

export type ArticleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ArticleFiltersInput>>>;
  content?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  excerpt?: InputMaybe<StringFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<ArticleFiltersInput>;
  not?: InputMaybe<ArticleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ArticleFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ArticleInput = {
  content?: InputMaybe<Scalars["String"]["input"]>;
  excerpt?: InputMaybe<Scalars["String"]["input"]>;
  featureImage?: InputMaybe<Scalars["ID"]["input"]>;
  publishedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type ArticleRelationResponseCollection = {
  __typename?: "ArticleRelationResponseCollection";
  nodes: Array<Article>;
};

export type BooleanFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars["Boolean"]["input"]>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars["Boolean"]["input"]>>>;
  contains?: InputMaybe<Scalars["Boolean"]["input"]>;
  containsi?: InputMaybe<Scalars["Boolean"]["input"]>;
  endsWith?: InputMaybe<Scalars["Boolean"]["input"]>;
  eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  eqi?: InputMaybe<Scalars["Boolean"]["input"]>;
  gt?: InputMaybe<Scalars["Boolean"]["input"]>;
  gte?: InputMaybe<Scalars["Boolean"]["input"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["Boolean"]["input"]>>>;
  lt?: InputMaybe<Scalars["Boolean"]["input"]>;
  lte?: InputMaybe<Scalars["Boolean"]["input"]>;
  ne?: InputMaybe<Scalars["Boolean"]["input"]>;
  nei?: InputMaybe<Scalars["Boolean"]["input"]>;
  not?: InputMaybe<BooleanFilterInput>;
  notContains?: InputMaybe<Scalars["Boolean"]["input"]>;
  notContainsi?: InputMaybe<Scalars["Boolean"]["input"]>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars["Boolean"]["input"]>>>;
  notNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  null?: InputMaybe<Scalars["Boolean"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Scalars["Boolean"]["input"]>>>;
  startsWith?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ComponentBasicImage = {
  __typename?: "ComponentBasicImage";
  alternativeText?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  media?: Maybe<UploadFile>;
  style?: Maybe<Enum_Componentbasicimage_Style>;
};

export type ComponentBasicParagraph = {
  __typename?: "ComponentBasicParagraph";
  Content?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
};

export type ComponentBasicQuote = {
  __typename?: "ComponentBasicQuote";
  author?: Maybe<Scalars["String"]["output"]>;
  content?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
};

export type ComponentBasicYoutube = {
  __typename?: "ComponentBasicYoutube";
  id: Scalars["ID"]["output"];
  url?: Maybe<Scalars["String"]["output"]>;
};

export type DateTimeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]["input"]>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]["input"]>>>;
  contains?: InputMaybe<Scalars["DateTime"]["input"]>;
  containsi?: InputMaybe<Scalars["DateTime"]["input"]>;
  endsWith?: InputMaybe<Scalars["DateTime"]["input"]>;
  eq?: InputMaybe<Scalars["DateTime"]["input"]>;
  eqi?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]["input"]>>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  ne?: InputMaybe<Scalars["DateTime"]["input"]>;
  nei?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<DateTimeFilterInput>;
  notContains?: InputMaybe<Scalars["DateTime"]["input"]>;
  notContainsi?: InputMaybe<Scalars["DateTime"]["input"]>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]["input"]>>>;
  notNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  null?: InputMaybe<Scalars["Boolean"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Scalars["DateTime"]["input"]>>>;
  startsWith?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type DeleteMutationResponse = {
  __typename?: "DeleteMutationResponse";
  documentId: Scalars["ID"]["output"];
};

export enum Enum_Componentbasicimage_Style {
  FullSize = "fullSize",
  Left = "left",
  None = "none",
  Right = "right",
}

export enum Enum_Servicemessage_Environment {
  Demo = "demo",
  Production = "production",
  Staging = "staging",
}

export enum Enum_Servicemessage_Message_Type {
  Error = "ERROR",
  Info = "INFO",
  Warning = "WARNING",
}

export type Error = {
  __typename?: "Error";
  code: Scalars["String"]["output"];
  message?: Maybe<Scalars["String"]["output"]>;
};

export type FancyArticle = {
  __typename?: "FancyArticle";
  Content?: Maybe<Array<Maybe<FancyArticleContentDynamicZone>>>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentId: Scalars["ID"]["output"];
  locale?: Maybe<Scalars["String"]["output"]>;
  localizations: Array<Maybe<FancyArticle>>;
  localizations_connection?: Maybe<FancyArticleRelationResponseCollection>;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  slug?: Maybe<Scalars["String"]["output"]>;
  subtitle?: Maybe<Scalars["String"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type FancyArticleLocalizationsArgs = {
  filters?: InputMaybe<FancyArticleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type FancyArticleLocalizations_ConnectionArgs = {
  filters?: InputMaybe<FancyArticleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type FancyArticleContentDynamicZone =
  | ComponentBasicImage
  | ComponentBasicParagraph
  | ComponentBasicQuote
  | Error;

export type FancyArticleEntityResponseCollection = {
  __typename?: "FancyArticleEntityResponseCollection";
  nodes: Array<FancyArticle>;
  pageInfo: Pagination;
};

export type FancyArticleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<FancyArticleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<FancyArticleFiltersInput>;
  not?: InputMaybe<FancyArticleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<FancyArticleFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  subtitle?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type FancyArticleInput = {
  Content?: InputMaybe<
    Array<Scalars["FancyArticleContentDynamicZoneInput"]["input"]>
  >;
  publishedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  slug?: InputMaybe<Scalars["String"]["input"]>;
  subtitle?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type FancyArticleRelationResponseCollection = {
  __typename?: "FancyArticleRelationResponseCollection";
  nodes: Array<FancyArticle>;
};

export type FileInfoInput = {
  alternativeText?: InputMaybe<Scalars["String"]["input"]>;
  caption?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type FloatFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars["Float"]["input"]>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars["Float"]["input"]>>>;
  contains?: InputMaybe<Scalars["Float"]["input"]>;
  containsi?: InputMaybe<Scalars["Float"]["input"]>;
  endsWith?: InputMaybe<Scalars["Float"]["input"]>;
  eq?: InputMaybe<Scalars["Float"]["input"]>;
  eqi?: InputMaybe<Scalars["Float"]["input"]>;
  gt?: InputMaybe<Scalars["Float"]["input"]>;
  gte?: InputMaybe<Scalars["Float"]["input"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["Float"]["input"]>>>;
  lt?: InputMaybe<Scalars["Float"]["input"]>;
  lte?: InputMaybe<Scalars["Float"]["input"]>;
  ne?: InputMaybe<Scalars["Float"]["input"]>;
  nei?: InputMaybe<Scalars["Float"]["input"]>;
  not?: InputMaybe<FloatFilterInput>;
  notContains?: InputMaybe<Scalars["Float"]["input"]>;
  notContainsi?: InputMaybe<Scalars["Float"]["input"]>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars["Float"]["input"]>>>;
  notNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  null?: InputMaybe<Scalars["Boolean"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Scalars["Float"]["input"]>>>;
  startsWith?: InputMaybe<Scalars["Float"]["input"]>;
};

export type GenericMorph =
  | Article
  | ComponentBasicImage
  | ComponentBasicParagraph
  | ComponentBasicQuote
  | ComponentBasicYoutube
  | FancyArticle
  | I18NLocale
  | ReviewWorkflowsWorkflow
  | ReviewWorkflowsWorkflowStage
  | ServiceMessage
  | TransportArticle
  | UploadFile
  | UsersPermissionsPermission
  | UsersPermissionsRole
  | UsersPermissionsUser;

export type I18NLocale = {
  __typename?: "I18NLocale";
  code?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentId: Scalars["ID"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type I18NLocaleEntityResponseCollection = {
  __typename?: "I18NLocaleEntityResponseCollection";
  nodes: Array<I18NLocale>;
  pageInfo: Pagination;
};

export type I18NLocaleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  code?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<I18NLocaleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type IdFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  contains?: InputMaybe<Scalars["ID"]["input"]>;
  containsi?: InputMaybe<Scalars["ID"]["input"]>;
  endsWith?: InputMaybe<Scalars["ID"]["input"]>;
  eq?: InputMaybe<Scalars["ID"]["input"]>;
  eqi?: InputMaybe<Scalars["ID"]["input"]>;
  gt?: InputMaybe<Scalars["ID"]["input"]>;
  gte?: InputMaybe<Scalars["ID"]["input"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  lt?: InputMaybe<Scalars["ID"]["input"]>;
  lte?: InputMaybe<Scalars["ID"]["input"]>;
  ne?: InputMaybe<Scalars["ID"]["input"]>;
  nei?: InputMaybe<Scalars["ID"]["input"]>;
  not?: InputMaybe<IdFilterInput>;
  notContains?: InputMaybe<Scalars["ID"]["input"]>;
  notContainsi?: InputMaybe<Scalars["ID"]["input"]>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  notNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  null?: InputMaybe<Scalars["Boolean"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  startsWith?: InputMaybe<Scalars["ID"]["input"]>;
};

export type IntFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  contains?: InputMaybe<Scalars["Int"]["input"]>;
  containsi?: InputMaybe<Scalars["Int"]["input"]>;
  endsWith?: InputMaybe<Scalars["Int"]["input"]>;
  eq?: InputMaybe<Scalars["Int"]["input"]>;
  eqi?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  ne?: InputMaybe<Scalars["Int"]["input"]>;
  nei?: InputMaybe<Scalars["Int"]["input"]>;
  not?: InputMaybe<IntFilterInput>;
  notContains?: InputMaybe<Scalars["Int"]["input"]>;
  notContainsi?: InputMaybe<Scalars["Int"]["input"]>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  notNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  null?: InputMaybe<Scalars["Boolean"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  startsWith?: InputMaybe<Scalars["Int"]["input"]>;
};

export type JsonFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars["JSON"]["input"]>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars["JSON"]["input"]>>>;
  contains?: InputMaybe<Scalars["JSON"]["input"]>;
  containsi?: InputMaybe<Scalars["JSON"]["input"]>;
  endsWith?: InputMaybe<Scalars["JSON"]["input"]>;
  eq?: InputMaybe<Scalars["JSON"]["input"]>;
  eqi?: InputMaybe<Scalars["JSON"]["input"]>;
  gt?: InputMaybe<Scalars["JSON"]["input"]>;
  gte?: InputMaybe<Scalars["JSON"]["input"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["JSON"]["input"]>>>;
  lt?: InputMaybe<Scalars["JSON"]["input"]>;
  lte?: InputMaybe<Scalars["JSON"]["input"]>;
  ne?: InputMaybe<Scalars["JSON"]["input"]>;
  nei?: InputMaybe<Scalars["JSON"]["input"]>;
  not?: InputMaybe<JsonFilterInput>;
  notContains?: InputMaybe<Scalars["JSON"]["input"]>;
  notContainsi?: InputMaybe<Scalars["JSON"]["input"]>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars["JSON"]["input"]>>>;
  notNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  null?: InputMaybe<Scalars["Boolean"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Scalars["JSON"]["input"]>>>;
  startsWith?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  /** Change user password. Confirm with the current password. */
  changePassword?: Maybe<UsersPermissionsLoginPayload>;
  createArticle?: Maybe<Article>;
  createFancyArticle?: Maybe<FancyArticle>;
  createReviewWorkflowsWorkflow?: Maybe<ReviewWorkflowsWorkflow>;
  createReviewWorkflowsWorkflowStage?: Maybe<ReviewWorkflowsWorkflowStage>;
  createServiceMessage?: Maybe<ServiceMessage>;
  createTransportArticle?: Maybe<TransportArticle>;
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>;
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  deleteArticle?: Maybe<DeleteMutationResponse>;
  deleteFancyArticle?: Maybe<DeleteMutationResponse>;
  deleteReviewWorkflowsWorkflow?: Maybe<DeleteMutationResponse>;
  deleteReviewWorkflowsWorkflowStage?: Maybe<DeleteMutationResponse>;
  deleteServiceMessage?: Maybe<DeleteMutationResponse>;
  deleteTransportArticle?: Maybe<DeleteMutationResponse>;
  deleteUploadFile?: Maybe<UploadFile>;
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>;
  /** Delete an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse;
  /** Confirm an email users email address */
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
  /** Request a reset password token */
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>;
  login: UsersPermissionsLoginPayload;
  /** Register a user */
  register: UsersPermissionsLoginPayload;
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  updateArticle?: Maybe<Article>;
  updateFancyArticle?: Maybe<FancyArticle>;
  updateReviewWorkflowsWorkflow?: Maybe<ReviewWorkflowsWorkflow>;
  updateReviewWorkflowsWorkflowStage?: Maybe<ReviewWorkflowsWorkflowStage>;
  updateServiceMessage?: Maybe<ServiceMessage>;
  updateTransportArticle?: Maybe<TransportArticle>;
  updateUploadFile: UploadFile;
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>;
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse;
};

export type MutationChangePasswordArgs = {
  currentPassword: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  passwordConfirmation: Scalars["String"]["input"];
};

export type MutationCreateArticleArgs = {
  data: ArticleInput;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationCreateFancyArticleArgs = {
  data: FancyArticleInput;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationCreateReviewWorkflowsWorkflowArgs = {
  data: ReviewWorkflowsWorkflowInput;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationCreateReviewWorkflowsWorkflowStageArgs = {
  data: ReviewWorkflowsWorkflowStageInput;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationCreateServiceMessageArgs = {
  data: ServiceMessageInput;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationCreateTransportArticleArgs = {
  data: TransportArticleInput;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationCreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
};

export type MutationCreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
};

export type MutationDeleteArticleArgs = {
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
};

export type MutationDeleteFancyArticleArgs = {
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
};

export type MutationDeleteReviewWorkflowsWorkflowArgs = {
  documentId: Scalars["ID"]["input"];
};

export type MutationDeleteReviewWorkflowsWorkflowStageArgs = {
  documentId: Scalars["ID"]["input"];
};

export type MutationDeleteServiceMessageArgs = {
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
};

export type MutationDeleteTransportArticleArgs = {
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
};

export type MutationDeleteUploadFileArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteUsersPermissionsRoleArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteUsersPermissionsUserArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationEmailConfirmationArgs = {
  confirmation: Scalars["String"]["input"];
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"]["input"];
};

export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};

export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};

export type MutationResetPasswordArgs = {
  code: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  passwordConfirmation: Scalars["String"]["input"];
};

export type MutationUpdateArticleArgs = {
  data: ArticleInput;
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationUpdateFancyArticleArgs = {
  data: FancyArticleInput;
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationUpdateReviewWorkflowsWorkflowArgs = {
  data: ReviewWorkflowsWorkflowInput;
  documentId: Scalars["ID"]["input"];
  status?: InputMaybe<PublicationStatus>;
};

export type MutationUpdateReviewWorkflowsWorkflowStageArgs = {
  data: ReviewWorkflowsWorkflowStageInput;
  documentId: Scalars["ID"]["input"];
  status?: InputMaybe<PublicationStatus>;
};

export type MutationUpdateServiceMessageArgs = {
  data: ServiceMessageInput;
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationUpdateTransportArticleArgs = {
  data: TransportArticleInput;
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type MutationUpdateUploadFileArgs = {
  id: Scalars["ID"]["input"];
  info?: InputMaybe<FileInfoInput>;
};

export type MutationUpdateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput;
  id: Scalars["ID"]["input"];
};

export type MutationUpdateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput;
  id: Scalars["ID"]["input"];
};

export type Pagination = {
  __typename?: "Pagination";
  page: Scalars["Int"]["output"];
  pageCount: Scalars["Int"]["output"];
  pageSize: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
};

export type PaginationArg = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  start?: InputMaybe<Scalars["Int"]["input"]>;
};

export enum PublicationStatus {
  Draft = "DRAFT",
  Published = "PUBLISHED",
}

export type Query = {
  __typename?: "Query";
  article?: Maybe<Article>;
  articles: Array<Maybe<Article>>;
  articles_connection?: Maybe<ArticleEntityResponseCollection>;
  fancyArticle?: Maybe<FancyArticle>;
  fancyArticles: Array<Maybe<FancyArticle>>;
  fancyArticles_connection?: Maybe<FancyArticleEntityResponseCollection>;
  i18NLocale?: Maybe<I18NLocale>;
  i18NLocales: Array<Maybe<I18NLocale>>;
  i18NLocales_connection?: Maybe<I18NLocaleEntityResponseCollection>;
  me?: Maybe<UsersPermissionsMe>;
  reviewWorkflowsWorkflow?: Maybe<ReviewWorkflowsWorkflow>;
  reviewWorkflowsWorkflowStage?: Maybe<ReviewWorkflowsWorkflowStage>;
  reviewWorkflowsWorkflowStages: Array<Maybe<ReviewWorkflowsWorkflowStage>>;
  reviewWorkflowsWorkflowStages_connection?: Maybe<ReviewWorkflowsWorkflowStageEntityResponseCollection>;
  reviewWorkflowsWorkflows: Array<Maybe<ReviewWorkflowsWorkflow>>;
  reviewWorkflowsWorkflows_connection?: Maybe<ReviewWorkflowsWorkflowEntityResponseCollection>;
  serviceMessage?: Maybe<ServiceMessage>;
  serviceMessages: Array<Maybe<ServiceMessage>>;
  serviceMessages_connection?: Maybe<ServiceMessageEntityResponseCollection>;
  transportArticle?: Maybe<TransportArticle>;
  transportArticles: Array<Maybe<TransportArticle>>;
  transportArticles_connection?: Maybe<TransportArticleEntityResponseCollection>;
  uploadFile?: Maybe<UploadFile>;
  uploadFiles: Array<Maybe<UploadFile>>;
  uploadFiles_connection?: Maybe<UploadFileEntityResponseCollection>;
  usersPermissionsRole?: Maybe<UsersPermissionsRole>;
  usersPermissionsRoles: Array<Maybe<UsersPermissionsRole>>;
  usersPermissionsRoles_connection?: Maybe<UsersPermissionsRoleEntityResponseCollection>;
  usersPermissionsUser?: Maybe<UsersPermissionsUser>;
  usersPermissionsUsers: Array<Maybe<UsersPermissionsUser>>;
  usersPermissionsUsers_connection?: Maybe<UsersPermissionsUserEntityResponseCollection>;
};

export type QueryArticleArgs = {
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryArticlesArgs = {
  filters?: InputMaybe<ArticleFiltersInput>;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryArticles_ConnectionArgs = {
  filters?: InputMaybe<ArticleFiltersInput>;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryFancyArticleArgs = {
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryFancyArticlesArgs = {
  filters?: InputMaybe<FancyArticleFiltersInput>;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryFancyArticles_ConnectionArgs = {
  filters?: InputMaybe<FancyArticleFiltersInput>;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryI18NLocaleArgs = {
  documentId: Scalars["ID"]["input"];
  status?: InputMaybe<PublicationStatus>;
};

export type QueryI18NLocalesArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryI18NLocales_ConnectionArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryReviewWorkflowsWorkflowArgs = {
  documentId: Scalars["ID"]["input"];
  status?: InputMaybe<PublicationStatus>;
};

export type QueryReviewWorkflowsWorkflowStageArgs = {
  documentId: Scalars["ID"]["input"];
  status?: InputMaybe<PublicationStatus>;
};

export type QueryReviewWorkflowsWorkflowStagesArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryReviewWorkflowsWorkflowStages_ConnectionArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryReviewWorkflowsWorkflowsArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryReviewWorkflowsWorkflows_ConnectionArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryServiceMessageArgs = {
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryServiceMessagesArgs = {
  filters?: InputMaybe<ServiceMessageFiltersInput>;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryServiceMessages_ConnectionArgs = {
  filters?: InputMaybe<ServiceMessageFiltersInput>;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryTransportArticleArgs = {
  documentId: Scalars["ID"]["input"];
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryTransportArticlesArgs = {
  filters?: InputMaybe<TransportArticleFiltersInput>;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryTransportArticles_ConnectionArgs = {
  filters?: InputMaybe<TransportArticleFiltersInput>;
  locale?: InputMaybe<Scalars["I18NLocaleCode"]["input"]>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryUploadFileArgs = {
  documentId: Scalars["ID"]["input"];
  status?: InputMaybe<PublicationStatus>;
};

export type QueryUploadFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryUploadFiles_ConnectionArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryUsersPermissionsRoleArgs = {
  documentId: Scalars["ID"]["input"];
  status?: InputMaybe<PublicationStatus>;
};

export type QueryUsersPermissionsRolesArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryUsersPermissionsRoles_ConnectionArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryUsersPermissionsUserArgs = {
  documentId: Scalars["ID"]["input"];
  status?: InputMaybe<PublicationStatus>;
};

export type QueryUsersPermissionsUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type QueryUsersPermissionsUsers_ConnectionArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  status?: InputMaybe<PublicationStatus>;
};

export type ReviewWorkflowsWorkflow = {
  __typename?: "ReviewWorkflowsWorkflow";
  contentTypes: Scalars["JSON"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentId: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  stageRequiredToPublish?: Maybe<ReviewWorkflowsWorkflowStage>;
  stages: Array<Maybe<ReviewWorkflowsWorkflowStage>>;
  stages_connection?: Maybe<ReviewWorkflowsWorkflowStageRelationResponseCollection>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ReviewWorkflowsWorkflowStagesArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ReviewWorkflowsWorkflowStages_ConnectionArgs = {
  filters?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ReviewWorkflowsWorkflowEntityResponseCollection = {
  __typename?: "ReviewWorkflowsWorkflowEntityResponseCollection";
  nodes: Array<ReviewWorkflowsWorkflow>;
  pageInfo: Pagination;
};

export type ReviewWorkflowsWorkflowFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ReviewWorkflowsWorkflowFiltersInput>>>;
  contentTypes?: InputMaybe<JsonFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ReviewWorkflowsWorkflowFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ReviewWorkflowsWorkflowFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  stageRequiredToPublish?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  stages?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type ReviewWorkflowsWorkflowInput = {
  contentTypes?: InputMaybe<Scalars["JSON"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  publishedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  stageRequiredToPublish?: InputMaybe<Scalars["ID"]["input"]>;
  stages?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

export type ReviewWorkflowsWorkflowStage = {
  __typename?: "ReviewWorkflowsWorkflowStage";
  color?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentId: Scalars["ID"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  workflow?: Maybe<ReviewWorkflowsWorkflow>;
};

export type ReviewWorkflowsWorkflowStageEntityResponseCollection = {
  __typename?: "ReviewWorkflowsWorkflowStageEntityResponseCollection";
  nodes: Array<ReviewWorkflowsWorkflowStage>;
  pageInfo: Pagination;
};

export type ReviewWorkflowsWorkflowStageFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>>>;
  color?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ReviewWorkflowsWorkflowStageFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  workflow?: InputMaybe<ReviewWorkflowsWorkflowFiltersInput>;
};

export type ReviewWorkflowsWorkflowStageInput = {
  color?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  publishedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  workflow?: InputMaybe<Scalars["ID"]["input"]>;
};

export type ReviewWorkflowsWorkflowStageRelationResponseCollection = {
  __typename?: "ReviewWorkflowsWorkflowStageRelationResponseCollection";
  nodes: Array<ReviewWorkflowsWorkflowStage>;
};

export type ServiceMessage = {
  __typename?: "ServiceMessage";
  channel_adminportal?: Maybe<Scalars["Boolean"]["output"]>;
  channel_publiseringportal?: Maybe<Scalars["Boolean"]["output"]>;
  channel_registreringportal?: Maybe<Scalars["Boolean"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  documentId: Scalars["ID"]["output"];
  environment: Enum_Servicemessage_Environment;
  locale?: Maybe<Scalars["String"]["output"]>;
  localizations: Array<Maybe<ServiceMessage>>;
  localizations_connection?: Maybe<ServiceMessageRelationResponseCollection>;
  message_type: Enum_Servicemessage_Message_Type;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  short_description: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  valid_from: Scalars["DateTime"]["output"];
  valid_to?: Maybe<Scalars["DateTime"]["output"]>;
};

export type ServiceMessageLocalizationsArgs = {
  filters?: InputMaybe<ServiceMessageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ServiceMessageLocalizations_ConnectionArgs = {
  filters?: InputMaybe<ServiceMessageFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ServiceMessageEntityResponseCollection = {
  __typename?: "ServiceMessageEntityResponseCollection";
  nodes: Array<ServiceMessage>;
  pageInfo: Pagination;
};

export type ServiceMessageFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<ServiceMessageFiltersInput>>>;
  channel_adminportal?: InputMaybe<BooleanFilterInput>;
  channel_publiseringportal?: InputMaybe<BooleanFilterInput>;
  channel_registreringportal?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  environment?: InputMaybe<StringFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<ServiceMessageFiltersInput>;
  message_type?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<ServiceMessageFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<ServiceMessageFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  short_description?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  valid_from?: InputMaybe<DateTimeFilterInput>;
  valid_to?: InputMaybe<DateTimeFilterInput>;
};

export type ServiceMessageInput = {
  channel_adminportal?: InputMaybe<Scalars["Boolean"]["input"]>;
  channel_publiseringportal?: InputMaybe<Scalars["Boolean"]["input"]>;
  channel_registreringportal?: InputMaybe<Scalars["Boolean"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  environment?: InputMaybe<Enum_Servicemessage_Environment>;
  message_type?: InputMaybe<Enum_Servicemessage_Message_Type>;
  publishedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  short_description?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  valid_from?: InputMaybe<Scalars["DateTime"]["input"]>;
  valid_to?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type ServiceMessageRelationResponseCollection = {
  __typename?: "ServiceMessageRelationResponseCollection";
  nodes: Array<ServiceMessage>;
};

export type StringFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  between?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  contains?: InputMaybe<Scalars["String"]["input"]>;
  containsi?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  eq?: InputMaybe<Scalars["String"]["input"]>;
  eqi?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  ne?: InputMaybe<Scalars["String"]["input"]>;
  nei?: InputMaybe<Scalars["String"]["input"]>;
  not?: InputMaybe<StringFilterInput>;
  notContains?: InputMaybe<Scalars["String"]["input"]>;
  notContainsi?: InputMaybe<Scalars["String"]["input"]>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  notNull?: InputMaybe<Scalars["Boolean"]["input"]>;
  null?: InputMaybe<Scalars["Boolean"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type TransportArticle = {
  __typename?: "TransportArticle";
  Content?: Maybe<Array<Maybe<TransportArticleContentDynamicZone>>>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentId: Scalars["ID"]["output"];
  locale?: Maybe<Scalars["String"]["output"]>;
  localizations: Array<Maybe<TransportArticle>>;
  localizations_connection?: Maybe<TransportArticleRelationResponseCollection>;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  slug?: Maybe<Scalars["String"]["output"]>;
  subtitle?: Maybe<Scalars["String"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type TransportArticleLocalizationsArgs = {
  filters?: InputMaybe<TransportArticleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type TransportArticleLocalizations_ConnectionArgs = {
  filters?: InputMaybe<TransportArticleFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type TransportArticleContentDynamicZone =
  | ComponentBasicImage
  | ComponentBasicParagraph
  | ComponentBasicQuote
  | ComponentBasicYoutube
  | Error;

export type TransportArticleEntityResponseCollection = {
  __typename?: "TransportArticleEntityResponseCollection";
  nodes: Array<TransportArticle>;
  pageInfo: Pagination;
};

export type TransportArticleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<TransportArticleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  locale?: InputMaybe<StringFilterInput>;
  localizations?: InputMaybe<TransportArticleFiltersInput>;
  not?: InputMaybe<TransportArticleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<TransportArticleFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  slug?: InputMaybe<StringFilterInput>;
  subtitle?: InputMaybe<StringFilterInput>;
  title?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type TransportArticleInput = {
  Content?: InputMaybe<
    Array<Scalars["TransportArticleContentDynamicZoneInput"]["input"]>
  >;
  publishedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  slug?: InputMaybe<Scalars["String"]["input"]>;
  subtitle?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type TransportArticleRelationResponseCollection = {
  __typename?: "TransportArticleRelationResponseCollection";
  nodes: Array<TransportArticle>;
};

export type UploadFile = {
  __typename?: "UploadFile";
  alternativeText?: Maybe<Scalars["String"]["output"]>;
  caption?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentId: Scalars["ID"]["output"];
  ext?: Maybe<Scalars["String"]["output"]>;
  formats?: Maybe<Scalars["JSON"]["output"]>;
  hash: Scalars["String"]["output"];
  height?: Maybe<Scalars["Int"]["output"]>;
  mime: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  previewUrl?: Maybe<Scalars["String"]["output"]>;
  provider: Scalars["String"]["output"];
  provider_metadata?: Maybe<Scalars["JSON"]["output"]>;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  related?: Maybe<Array<Maybe<GenericMorph>>>;
  size: Scalars["Float"]["output"];
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  url: Scalars["String"]["output"];
  width?: Maybe<Scalars["Int"]["output"]>;
};

export type UploadFileEntityResponseCollection = {
  __typename?: "UploadFileEntityResponseCollection";
  nodes: Array<UploadFile>;
  pageInfo: Pagination;
};

export type UploadFileFiltersInput = {
  alternativeText?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  caption?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  ext?: InputMaybe<StringFilterInput>;
  formats?: InputMaybe<JsonFilterInput>;
  hash?: InputMaybe<StringFilterInput>;
  height?: InputMaybe<IntFilterInput>;
  mime?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UploadFileFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>;
  previewUrl?: InputMaybe<StringFilterInput>;
  provider?: InputMaybe<StringFilterInput>;
  provider_metadata?: InputMaybe<JsonFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  size?: InputMaybe<FloatFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  url?: InputMaybe<StringFilterInput>;
  width?: InputMaybe<IntFilterInput>;
};

export type UsersPermissionsCreateRolePayload = {
  __typename?: "UsersPermissionsCreateRolePayload";
  ok: Scalars["Boolean"]["output"];
};

export type UsersPermissionsDeleteRolePayload = {
  __typename?: "UsersPermissionsDeleteRolePayload";
  ok: Scalars["Boolean"]["output"];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  provider?: Scalars["String"]["input"];
};

export type UsersPermissionsLoginPayload = {
  __typename?: "UsersPermissionsLoginPayload";
  jwt?: Maybe<Scalars["String"]["output"]>;
  user: UsersPermissionsMe;
};

export type UsersPermissionsMe = {
  __typename?: "UsersPermissionsMe";
  blocked?: Maybe<Scalars["Boolean"]["output"]>;
  confirmed?: Maybe<Scalars["Boolean"]["output"]>;
  documentId: Scalars["ID"]["output"];
  email?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  role?: Maybe<UsersPermissionsMeRole>;
  username: Scalars["String"]["output"];
};

export type UsersPermissionsMeRole = {
  __typename?: "UsersPermissionsMeRole";
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  type?: Maybe<Scalars["String"]["output"]>;
};

export type UsersPermissionsPasswordPayload = {
  __typename?: "UsersPermissionsPasswordPayload";
  ok: Scalars["Boolean"]["output"];
};

export type UsersPermissionsPermission = {
  __typename?: "UsersPermissionsPermission";
  action: Scalars["String"]["output"];
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentId: Scalars["ID"]["output"];
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  role?: Maybe<UsersPermissionsRole>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type UsersPermissionsPermissionFiltersInput = {
  action?: InputMaybe<StringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  not?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
};

export type UsersPermissionsPermissionRelationResponseCollection = {
  __typename?: "UsersPermissionsPermissionRelationResponseCollection";
  nodes: Array<UsersPermissionsPermission>;
};

export type UsersPermissionsRegisterInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type UsersPermissionsRole = {
  __typename?: "UsersPermissionsRole";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  documentId: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  permissions: Array<Maybe<UsersPermissionsPermission>>;
  permissions_connection?: Maybe<UsersPermissionsPermissionRelationResponseCollection>;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  users: Array<Maybe<UsersPermissionsUser>>;
  users_connection?: Maybe<UsersPermissionsUserRelationResponseCollection>;
};

export type UsersPermissionsRolePermissionsArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type UsersPermissionsRolePermissions_ConnectionArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type UsersPermissionsRoleUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type UsersPermissionsRoleUsers_ConnectionArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>;
  pagination?: InputMaybe<PaginationArg>;
  sort?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type UsersPermissionsRoleEntityResponseCollection = {
  __typename?: "UsersPermissionsRoleEntityResponseCollection";
  nodes: Array<UsersPermissionsRole>;
  pageInfo: Pagination;
};

export type UsersPermissionsRoleFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>;
  permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  type?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  users?: InputMaybe<UsersPermissionsUserFiltersInput>;
};

export type UsersPermissionsRoleInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  publishedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  users?: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
};

export type UsersPermissionsUpdateRolePayload = {
  __typename?: "UsersPermissionsUpdateRolePayload";
  ok: Scalars["Boolean"]["output"];
};

export type UsersPermissionsUser = {
  __typename?: "UsersPermissionsUser";
  blocked?: Maybe<Scalars["Boolean"]["output"]>;
  confirmed?: Maybe<Scalars["Boolean"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  documentId: Scalars["ID"]["output"];
  email: Scalars["String"]["output"];
  provider?: Maybe<Scalars["String"]["output"]>;
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
  role?: Maybe<UsersPermissionsRole>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
  username: Scalars["String"]["output"];
};

export type UsersPermissionsUserEntityResponse = {
  __typename?: "UsersPermissionsUserEntityResponse";
  data?: Maybe<UsersPermissionsUser>;
};

export type UsersPermissionsUserEntityResponseCollection = {
  __typename?: "UsersPermissionsUserEntityResponseCollection";
  nodes: Array<UsersPermissionsUser>;
  pageInfo: Pagination;
};

export type UsersPermissionsUserFiltersInput = {
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  blocked?: InputMaybe<BooleanFilterInput>;
  confirmed?: InputMaybe<BooleanFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  documentId?: InputMaybe<IdFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  not?: InputMaybe<UsersPermissionsUserFiltersInput>;
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>;
  provider?: InputMaybe<StringFilterInput>;
  publishedAt?: InputMaybe<DateTimeFilterInput>;
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>;
  updatedAt?: InputMaybe<DateTimeFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UsersPermissionsUserInput = {
  blocked?: InputMaybe<Scalars["Boolean"]["input"]>;
  confirmed?: InputMaybe<Scalars["Boolean"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  provider?: InputMaybe<Scalars["String"]["input"]>;
  publishedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
  role?: InputMaybe<Scalars["ID"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

export type UsersPermissionsUserRelationResponseCollection = {
  __typename?: "UsersPermissionsUserRelationResponseCollection";
  nodes: Array<UsersPermissionsUser>;
};

export type GetServiceMessagesQueryVariables = Exact<{
  today?: InputMaybe<Scalars["DateTime"]["input"]>;
  channelPubliseringPortal?: InputMaybe<Scalars["Boolean"]["input"]>;
  env?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetServiceMessagesQuery = {
  __typename?: "Query";
  serviceMessages: Array<{
    __typename?: "ServiceMessage";
    documentId: string;
    title: string;
    valid_from: string;
    valid_to?: string | null;
    message_type: Enum_Servicemessage_Message_Type;
    short_description: string;
    description?: string | null;
    environment: Enum_Servicemessage_Environment;
    channel_publiseringportal?: boolean | null;
    locale?: string | null;
    localizations: Array<{
      __typename?: "ServiceMessage";
      title: string;
      short_description: string;
      description?: string | null;
    } | null>;
  } | null>;
};

export type GetServiceMessageQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetServiceMessageQuery = {
  __typename?: "Query";
  serviceMessage?: {
    __typename?: "ServiceMessage";
    documentId: string;
    title: string;
    valid_from: string;
    valid_to?: string | null;
    message_type: Enum_Servicemessage_Message_Type;
    short_description: string;
    description?: string | null;
    locale?: string | null;
    localizations: Array<{
      __typename?: "ServiceMessage";
      title: string;
      short_description: string;
      description?: string | null;
    } | null>;
  } | null;
};

export const GetServiceMessagesDocument = `
    query GetServiceMessages($today: DateTime, $channelPubliseringPortal: Boolean, $env: String) {
  serviceMessages(
    filters: {valid_from: {lte: $today}, valid_to: {gte: $today}, channel_publiseringportal: {eq: $channelPubliseringPortal}, environment: {eq: $env}}
    sort: "valid_from:desc"
  ) {
    documentId
    title
    valid_from
    valid_to
    message_type
    short_description
    description
    environment
    channel_publiseringportal
    locale
    localizations {
      title
      short_description
      description
    }
  }
}
    `;

export const useGetServiceMessagesQuery = <
  TData = GetServiceMessagesQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables?: GetServiceMessagesQueryVariables,
  options?: UseQueryOptions<GetServiceMessagesQuery, TError, TData>,
  headers?: RequestInit["headers"],
) => {
  return useQuery<GetServiceMessagesQuery, TError, TData>(
    variables === undefined
      ? ["GetServiceMessages"]
      : ["GetServiceMessages", variables],
    fetcher<GetServiceMessagesQuery, GetServiceMessagesQueryVariables>(
      client,
      GetServiceMessagesDocument,
      variables,
      headers,
    ),
    options,
  );
};

useGetServiceMessagesQuery.getKey = (
  variables?: GetServiceMessagesQueryVariables,
) =>
  variables === undefined
    ? ["GetServiceMessages"]
    : ["GetServiceMessages", variables];

export const useInfiniteGetServiceMessagesQuery = <
  TData = GetServiceMessagesQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables?: GetServiceMessagesQueryVariables,
  options?: UseInfiniteQueryOptions<GetServiceMessagesQuery, TError, TData>,
  headers?: RequestInit["headers"],
) => {
  return useInfiniteQuery<GetServiceMessagesQuery, TError, TData>(
    variables === undefined
      ? ["GetServiceMessages.infinite"]
      : ["GetServiceMessages.infinite", variables],
    (metaData) =>
      fetcher<GetServiceMessagesQuery, GetServiceMessagesQueryVariables>(
        client,
        GetServiceMessagesDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
        headers,
      )(),
    options,
  );
};

useInfiniteGetServiceMessagesQuery.getKey = (
  variables?: GetServiceMessagesQueryVariables,
) =>
  variables === undefined
    ? ["GetServiceMessages.infinite"]
    : ["GetServiceMessages.infinite", variables];

useGetServiceMessagesQuery.fetcher = (
  client: GraphQLClient,
  variables?: GetServiceMessagesQueryVariables,
  headers?: RequestInit["headers"],
) =>
  fetcher<GetServiceMessagesQuery, GetServiceMessagesQueryVariables>(
    client,
    GetServiceMessagesDocument,
    variables,
    headers,
  );

export const GetServiceMessageDocument = `
    query GetServiceMessage($id: ID!) {
  serviceMessage(documentId: $id) {
    documentId
    title
    valid_from
    valid_to
    message_type
    short_description
    description
    locale
    localizations {
      title
      short_description
      description
    }
  }
}
    `;

export const useGetServiceMessageQuery = <
  TData = GetServiceMessageQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables: GetServiceMessageQueryVariables,
  options?: UseQueryOptions<GetServiceMessageQuery, TError, TData>,
  headers?: RequestInit["headers"],
) => {
  return useQuery<GetServiceMessageQuery, TError, TData>(
    ["GetServiceMessage", variables],
    fetcher<GetServiceMessageQuery, GetServiceMessageQueryVariables>(
      client,
      GetServiceMessageDocument,
      variables,
      headers,
    ),
    options,
  );
};

useGetServiceMessageQuery.getKey = (
  variables: GetServiceMessageQueryVariables,
) => ["GetServiceMessage", variables];

export const useInfiniteGetServiceMessageQuery = <
  TData = GetServiceMessageQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables: GetServiceMessageQueryVariables,
  options?: UseInfiniteQueryOptions<GetServiceMessageQuery, TError, TData>,
  headers?: RequestInit["headers"],
) => {
  return useInfiniteQuery<GetServiceMessageQuery, TError, TData>(
    ["GetServiceMessage.infinite", variables],
    (metaData) =>
      fetcher<GetServiceMessageQuery, GetServiceMessageQueryVariables>(
        client,
        GetServiceMessageDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
        headers,
      )(),
    options,
  );
};

useInfiniteGetServiceMessageQuery.getKey = (
  variables: GetServiceMessageQueryVariables,
) => ["GetServiceMessage.infinite", variables];

useGetServiceMessageQuery.fetcher = (
  client: GraphQLClient,
  variables: GetServiceMessageQueryVariables,
  headers?: RequestInit["headers"],
) =>
  fetcher<GetServiceMessageQuery, GetServiceMessageQueryVariables>(
    client,
    GetServiceMessageDocument,
    variables,
    headers,
  );
