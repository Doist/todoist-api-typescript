import axios from 'axios'
import { paramsSerializer } from './restClient'

const DEFAULT_BASE_URI = 'https://api.todoist.com/rest/v2/tasks'

describe('axios tests without mocking', () => {
    test('GET calls serialise arrays correctly', () => {
        const requestUri = axios.create().getUri({
            method: 'GET',
            baseURL: DEFAULT_BASE_URI,
            params: {
                ids: ['12345', '56789'],
            },
            paramsSerializer,
        })
        expect(requestUri).toEqual('https://api.todoist.com/rest/v2/tasks?ids=12345%2C56789')
    })
})
