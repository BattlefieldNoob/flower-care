import { getSdk } from '@flower-care/libs/dgraph-database'
import { Handler } from '@netlify/functions'
import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient("https://red-tree.eu-central-1.aws.cloud.dgraph.io/graphql", { headers: {} })

const sendDataToDgraph = async (requestBody: string) => {
    try {
        const sdk = getSdk(client)
        const result = await sdk.addReadings({ data: JSON.parse(requestBody) })
        console.log('result:', result.addReadings)
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
