/* eslint-disable */
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The DateTime scalar type represents date and time as a string in RFC3339 format.
   * For example: "1985-04-12T23:20:50.52Z" represents 20 mins 50.52 secs after the 23rd hour of Apr 12th 1985 in UTC.
   */
  DateTime: { input: any; output: any; }
  /**
   * The Int64 scalar type represents a signed 64‐bit numeric non‐fractional value.
   * Int64 can represent values in range [-(2^63),(2^63 - 1)].
   */
  Int64: { input: any; output: any; }
};

export type AddReadingsInput = {
  battery: Scalars['Int']['input'];
  fertility: Scalars['Int']['input'];
  moisture: Scalars['Int']['input'];
  sunlight: Scalars['Float']['input'];
  temperature: Scalars['Float']['input'];
  ts?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AddReadingsPayload = {
  __typename?: 'AddReadingsPayload';
  numUids?: Maybe<Scalars['Int']['output']>;
  readings?: Maybe<Array<Maybe<Readings>>>;
};


export type AddReadingsPayloadReadingsArgs = {
  filter?: InputMaybe<ReadingsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ReadingsOrder>;
};

export type AuthRule = {
  and?: InputMaybe<Array<InputMaybe<AuthRule>>>;
  not?: InputMaybe<AuthRule>;
  or?: InputMaybe<Array<InputMaybe<AuthRule>>>;
  rule?: InputMaybe<Scalars['String']['input']>;
};

export type ContainsFilter = {
  point?: InputMaybe<PointRef>;
  polygon?: InputMaybe<PolygonRef>;
};

export type CustomHttp = {
  body?: InputMaybe<Scalars['String']['input']>;
  forwardHeaders?: InputMaybe<Array<Scalars['String']['input']>>;
  graphql?: InputMaybe<Scalars['String']['input']>;
  introspectionHeaders?: InputMaybe<Array<Scalars['String']['input']>>;
  method: HttpMethod;
  mode?: InputMaybe<Mode>;
  secretHeaders?: InputMaybe<Array<Scalars['String']['input']>>;
  skipIntrospection?: InputMaybe<Scalars['Boolean']['input']>;
  url: Scalars['String']['input'];
};

export type DateTimeFilter = {
  between?: InputMaybe<DateTimeRange>;
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  ge?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  le?: InputMaybe<Scalars['DateTime']['input']>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DateTimeRange = {
  max: Scalars['DateTime']['input'];
  min: Scalars['DateTime']['input'];
};

export type DeleteReadingsPayload = {
  __typename?: 'DeleteReadingsPayload';
  msg?: Maybe<Scalars['String']['output']>;
  numUids?: Maybe<Scalars['Int']['output']>;
  readings?: Maybe<Array<Maybe<Readings>>>;
};


export type DeleteReadingsPayloadReadingsArgs = {
  filter?: InputMaybe<ReadingsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ReadingsOrder>;
};

export enum DgraphIndex {
  Bool = 'bool',
  Day = 'day',
  Exact = 'exact',
  Float = 'float',
  Fulltext = 'fulltext',
  Geo = 'geo',
  Hash = 'hash',
  Hour = 'hour',
  Int = 'int',
  Int64 = 'int64',
  Month = 'month',
  Regexp = 'regexp',
  Term = 'term',
  Trigram = 'trigram',
  Year = 'year'
}

export type FloatFilter = {
  between?: InputMaybe<FloatRange>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  ge?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  le?: InputMaybe<Scalars['Float']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
};

export type FloatRange = {
  max: Scalars['Float']['input'];
  min: Scalars['Float']['input'];
};

export type GenerateMutationParams = {
  add?: InputMaybe<Scalars['Boolean']['input']>;
  delete?: InputMaybe<Scalars['Boolean']['input']>;
  update?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GenerateQueryParams = {
  aggregate?: InputMaybe<Scalars['Boolean']['input']>;
  get?: InputMaybe<Scalars['Boolean']['input']>;
  password?: InputMaybe<Scalars['Boolean']['input']>;
  query?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum HttpMethod {
  Delete = 'DELETE',
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT'
}

export type Int64Filter = {
  between?: InputMaybe<Int64Range>;
  eq?: InputMaybe<Scalars['Int64']['input']>;
  ge?: InputMaybe<Scalars['Int64']['input']>;
  gt?: InputMaybe<Scalars['Int64']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int64']['input']>>>;
  le?: InputMaybe<Scalars['Int64']['input']>;
  lt?: InputMaybe<Scalars['Int64']['input']>;
};

export type Int64Range = {
  max: Scalars['Int64']['input'];
  min: Scalars['Int64']['input'];
};

export type IntFilter = {
  between?: InputMaybe<IntRange>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
};

export type IntRange = {
  max: Scalars['Int']['input'];
  min: Scalars['Int']['input'];
};

export type IntersectsFilter = {
  multiPolygon?: InputMaybe<MultiPolygonRef>;
  polygon?: InputMaybe<PolygonRef>;
};

export enum Mode {
  Batch = 'BATCH',
  Single = 'SINGLE'
}

export type MultiPolygon = {
  __typename?: 'MultiPolygon';
  polygons: Array<Polygon>;
};

export type MultiPolygonRef = {
  polygons: Array<PolygonRef>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addReadings?: Maybe<AddReadingsPayload>;
  deleteReadings?: Maybe<DeleteReadingsPayload>;
  updateReadings?: Maybe<UpdateReadingsPayload>;
};


export type MutationAddReadingsArgs = {
  input: Array<AddReadingsInput>;
};


export type MutationDeleteReadingsArgs = {
  filter: ReadingsFilter;
};


export type MutationUpdateReadingsArgs = {
  input: UpdateReadingsInput;
};

export type NearFilter = {
  coordinate: PointRef;
  distance: Scalars['Float']['input'];
};

export type Point = {
  __typename?: 'Point';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type PointGeoFilter = {
  near?: InputMaybe<NearFilter>;
  within?: InputMaybe<WithinFilter>;
};

export type PointList = {
  __typename?: 'PointList';
  points: Array<Point>;
};

export type PointListRef = {
  points: Array<PointRef>;
};

export type PointRef = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type Polygon = {
  __typename?: 'Polygon';
  coordinates: Array<PointList>;
};

export type PolygonGeoFilter = {
  contains?: InputMaybe<ContainsFilter>;
  intersects?: InputMaybe<IntersectsFilter>;
  near?: InputMaybe<NearFilter>;
  within?: InputMaybe<WithinFilter>;
};

export type PolygonRef = {
  coordinates: Array<PointListRef>;
};

export type Query = {
  __typename?: 'Query';
  aggregateReadings?: Maybe<ReadingsAggregateResult>;
  getReadings?: Maybe<Readings>;
  queryReadings?: Maybe<Array<Maybe<Readings>>>;
};


export type QueryAggregateReadingsArgs = {
  filter?: InputMaybe<ReadingsFilter>;
};


export type QueryGetReadingsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQueryReadingsArgs = {
  filter?: InputMaybe<ReadingsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ReadingsOrder>;
};

export type Readings = {
  __typename?: 'Readings';
  battery: Scalars['Int']['output'];
  fertility: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  moisture: Scalars['Int']['output'];
  sunlight: Scalars['Float']['output'];
  temperature: Scalars['Float']['output'];
  ts?: Maybe<Scalars['DateTime']['output']>;
};

export type ReadingsAggregateResult = {
  __typename?: 'ReadingsAggregateResult';
  batteryAvg?: Maybe<Scalars['Float']['output']>;
  batteryMax?: Maybe<Scalars['Int']['output']>;
  batteryMin?: Maybe<Scalars['Int']['output']>;
  batterySum?: Maybe<Scalars['Int']['output']>;
  count?: Maybe<Scalars['Int']['output']>;
  fertilityAvg?: Maybe<Scalars['Float']['output']>;
  fertilityMax?: Maybe<Scalars['Int']['output']>;
  fertilityMin?: Maybe<Scalars['Int']['output']>;
  fertilitySum?: Maybe<Scalars['Int']['output']>;
  moistureAvg?: Maybe<Scalars['Float']['output']>;
  moistureMax?: Maybe<Scalars['Int']['output']>;
  moistureMin?: Maybe<Scalars['Int']['output']>;
  moistureSum?: Maybe<Scalars['Int']['output']>;
  sunlightAvg?: Maybe<Scalars['Float']['output']>;
  sunlightMax?: Maybe<Scalars['Float']['output']>;
  sunlightMin?: Maybe<Scalars['Float']['output']>;
  sunlightSum?: Maybe<Scalars['Float']['output']>;
  temperatureAvg?: Maybe<Scalars['Float']['output']>;
  temperatureMax?: Maybe<Scalars['Float']['output']>;
  temperatureMin?: Maybe<Scalars['Float']['output']>;
  temperatureSum?: Maybe<Scalars['Float']['output']>;
  tsMax?: Maybe<Scalars['DateTime']['output']>;
  tsMin?: Maybe<Scalars['DateTime']['output']>;
};

export type ReadingsFilter = {
  and?: InputMaybe<Array<InputMaybe<ReadingsFilter>>>;
  has?: InputMaybe<Array<InputMaybe<ReadingsHasFilter>>>;
  id?: InputMaybe<Array<Scalars['ID']['input']>>;
  not?: InputMaybe<ReadingsFilter>;
  or?: InputMaybe<Array<InputMaybe<ReadingsFilter>>>;
  ts?: InputMaybe<DateTimeFilter>;
};

export enum ReadingsHasFilter {
  Battery = 'battery',
  Fertility = 'fertility',
  Moisture = 'moisture',
  Sunlight = 'sunlight',
  Temperature = 'temperature',
  Ts = 'ts'
}

export type ReadingsOrder = {
  asc?: InputMaybe<ReadingsOrderable>;
  desc?: InputMaybe<ReadingsOrderable>;
  then?: InputMaybe<ReadingsOrder>;
};

export enum ReadingsOrderable {
  Battery = 'battery',
  Fertility = 'fertility',
  Moisture = 'moisture',
  Sunlight = 'sunlight',
  Temperature = 'temperature',
  Ts = 'ts'
}

export type ReadingsPatch = {
  battery?: InputMaybe<Scalars['Int']['input']>;
  fertility?: InputMaybe<Scalars['Int']['input']>;
  moisture?: InputMaybe<Scalars['Int']['input']>;
  sunlight?: InputMaybe<Scalars['Float']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
  ts?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ReadingsRef = {
  battery?: InputMaybe<Scalars['Int']['input']>;
  fertility?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  moisture?: InputMaybe<Scalars['Int']['input']>;
  sunlight?: InputMaybe<Scalars['Float']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
  ts?: InputMaybe<Scalars['DateTime']['input']>;
};

export type StringExactFilter = {
  between?: InputMaybe<StringRange>;
  eq?: InputMaybe<Scalars['String']['input']>;
  ge?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  le?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
};

export type StringFullTextFilter = {
  alloftext?: InputMaybe<Scalars['String']['input']>;
  anyoftext?: InputMaybe<Scalars['String']['input']>;
};

export type StringHashFilter = {
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type StringRange = {
  max: Scalars['String']['input'];
  min: Scalars['String']['input'];
};

export type StringRegExpFilter = {
  regexp?: InputMaybe<Scalars['String']['input']>;
};

export type StringTermFilter = {
  allofterms?: InputMaybe<Scalars['String']['input']>;
  anyofterms?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReadingsInput = {
  filter: ReadingsFilter;
  remove?: InputMaybe<ReadingsPatch>;
  set?: InputMaybe<ReadingsPatch>;
};

export type UpdateReadingsPayload = {
  __typename?: 'UpdateReadingsPayload';
  numUids?: Maybe<Scalars['Int']['output']>;
  readings?: Maybe<Array<Maybe<Readings>>>;
};


export type UpdateReadingsPayloadReadingsArgs = {
  filter?: InputMaybe<ReadingsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ReadingsOrder>;
};

export type WithinFilter = {
  polygon: PolygonRef;
};

export type AllReadingsBetweenQueryVariables = Exact<{
  min: Scalars['DateTime']['input'];
  max: Scalars['DateTime']['input'];
}>;


export type AllReadingsBetweenQuery = { __typename?: 'Query', queryReadings?: Array<{ __typename?: 'Readings', ts?: any | null, battery: number, moisture: number, fertility: number, sunlight: number, temperature: number } | null> | null };

export const AllReadingsBetweenDocument = gql`
    query AllReadingsBetween($min: DateTime!, $max: DateTime!) {
  queryReadings(filter: {ts: {between: {min: $min, max: $max}}}) {
    ts
    battery
    moisture
    fertility
    sunlight
    temperature
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AllReadingsBetweenGQL extends Apollo.Query<AllReadingsBetweenQuery, AllReadingsBetweenQueryVariables> {
    override document = AllReadingsBetweenDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
