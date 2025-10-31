import type { HttpResponse } from '../types/http'
import * as restClient from '../rest-client'

export function setupRestClientMock(responseData: unknown, status = 200): jest.SpyInstance {
    const response: HttpResponse = {
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        headers: {},
        data: responseData,
    }
    return jest.spyOn(restClient, 'request').mockResolvedValue(response)
}
