import { json } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
    return json({ message: 'This is a test GET response' })
}

export const action: ActionFunction = async ({ request }) => {
    const body = await request.json()

    return json({
        message: 'This is a test POST response',
        receivedData: body,
    })
}
