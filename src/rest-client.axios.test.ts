import axios from 'axios'
import { paramsSerializer } from './rest-client'

const DEFAULT_BASE_URI = 'https://api.todoist.com/rest/v2/tasks'

describe('axios tests without mocking', () => {
    test('GET calls serialise arrays correctly', () => {
        const requestUri = axios.create().getUri({
            method: 'GET',
            baseURL: DEFAULT_BASE_URI,
            params: {
                ids: ['12345', '56789'],
            },
            paramsSerializer: {
                serialize: paramsSerializer,
            },
        })
        expect(requestUri).toEqual('https://api.todoist.com/rest/v2/tasks?ids=12345%2C56789')
    })

    test('GET calls do not serialise null values', () => {
        const requestUri = axios.create().getUri({
            method: 'GET',
            baseURL: DEFAULT_BASE_URI,
            params: {
                ids: null,
            },
            paramsSerializer: {
                serialize: paramsSerializer,
            },
        })
        expect(requestUri).toEqual('https://api.todoist.com/rest/v2/tasks')
    })

    test('GET calls do not serialise undefined values', () => {
        const requestUri = axios.create().getUri({
            method: 'GET',
            baseURL: DEFAULT_BASE_URI,
            params: {
                ids: undefined,
            },
            paramsSerializer: {
                serialize: paramsSerializer,
            },
        })
        expect(requestUri).toEqual('https://api.todoist.com/rest/v2/tasks')
    })
})
