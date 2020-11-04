import { mock } from 'jest-mock-extended'
import { AxiosResponse } from 'axios'
import * as restClient from '../restClient'

export function setupRestClientMock(responseData: unknown, status = 200): jest.SpyInstance {
    const response = mock<AxiosResponse>({ status, data: responseData })
    return jest.spyOn(restClient, 'request').mockResolvedValue(response)
}
