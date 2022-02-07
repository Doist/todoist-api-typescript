import { AxiosResponse } from 'axios'
import * as restClient from '../restClient'

export function setupRestClientMock(responseData: unknown, status = 200): jest.SpyInstance {
    const response = { status, data: responseData } as AxiosResponse
    return jest.spyOn(restClient, 'request').mockResolvedValue(response)
}
