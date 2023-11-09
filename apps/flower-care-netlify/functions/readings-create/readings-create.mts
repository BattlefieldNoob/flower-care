import { Handler } from '@netlify/functions'
import fetch from 'cross-fetch';
import { ApolloClient, gql, InMemoryCache, HttpLink } from '@apollo/client/core';

interface AddReadingsInput {
    moisture: number
    fertility: number
    sunlight: number
    temperature: number
    battery: number
    ts: string
}

interface AddReadingsPayload {
    numUids: number
}

const CREATE_READINGS = gql`
    mutation addReadings($data:[AddReadingsInput!]!){
        addReadings(input: $data){
            numUids
            readings{
                id
            }
        }
    }
`;

const apolloClient = new ApolloClient({
    link: new HttpLink({ uri: "https://red-tree.eu-central-1.aws.cloud.dgraph.io/graphql", fetch }),
    cache: new InMemoryCache(),
})

const sendDataToDgraph = async (requestBody: string) => {
    try {
        const reading = JSON.parse(requestBody) as AddReadingsInput

        console.log(reading)
        const result = await apolloClient.mutate<{ addReadings: AddReadingsPayload }, { data: AddReadingsInput }>
            ({
                mutation: CREATE_READINGS,
                variables: { data: reading }
            })
        console.log('result:', result.data)
        console.log('errors:', result.errors)
    } catch (error) {
        console.log(error)
        console.log(requestBody)
    }
}

const handler: Handler = async (event) => {

    switch (event.httpMethod) {
        case 'OPTIONS':
            return { statusCode: 204 }

        case 'POST':
            try {
                if (event.body) {
                    await sendDataToDgraph(event.body);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ message: "DONE!" })
                    };
                } else {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ message: "Bad Request: Missing request body" })
                    };
                }
            } catch (error) {
                return {
                    statusCode: error.statusCode || 500,
                    body: JSON.stringify(error),
                };
            }
        default:
            return {
                statusCode: 500,
                body: "Only POST are allowed!",
            };
    }

}

export { handler }

/*const a = async () => {

    var exampleData: AddReadingsInput = {
        battery: 40,
        fertility: 3000,
        sunlight: 200,
        moisture: 50,
        temperature: 25,
        ts: moment().format()
    }
    console.log(exampleData);

    const result = await sendDataToDgraph(JSON.stringify(exampleData))
    console.log(result);
}

a();*/
