import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const caveDroneServerApi = createApi({
  reducerPath: "cave-drone-server/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://cave-drone-server.shtoa.xyz",
  }),
  endpoints: (build) => ({
    getPlayerId: build.mutation({
      query: ({userData}) => ({
        url: "/init",
        method: "POST",
        body: userData
      }),
    }),
    getTokenChunk: build.query({
      query: ({id, idx}) => ({
        url:`/token/${idx}?id=${id}`,
      }),
    })
  }),
});

export const { useGetPlayerIdMutation, useGetTokenChunkQuery } = caveDroneServerApi;