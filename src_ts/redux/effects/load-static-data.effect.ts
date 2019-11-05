import {Dispatch} from 'redux';
import {AddStaticData, ResetStaticData} from '../actions/static-data.actions';
import {EtoolsRequest} from '../../endpoints/request';
import {getEndpoint} from '../../endpoints/endpoints';

const currentRequests: GenericObject = {};

export function loadStaticData(
  dataName: keyof IStaticDataState,
  params?: any,
  reset?: boolean
): (dispatch: Dispatch) => Promise<any> {
  return (dispatch: Dispatch) => {
    if (currentRequests[dataName]) {
      return currentRequests[dataName];
    }
    const endpoint: IEtoolsEndpoint = getEndpoint(dataName, params);
    if (!endpoint) {
      console.error(`Can not load static data "${dataName}". Reason: endpoint was not found.`);
      return Promise.resolve();
    }
    currentRequests[dataName] = EtoolsRequest.sendRequest({endpoint})
      .then((data: any) => {
        delete currentRequests[dataName];
        const staticData: any = data.results || data;
        if (reset) {
          dispatch(new ResetStaticData(dataName, staticData));
        } else {
          dispatch(new AddStaticData(dataName, staticData));
        }
        return data;
      })
      .catch((error: any) => {
        console.error(`Can not load static data "${dataName}". Reason: request error.`);
        console.error(error);
        delete currentRequests[dataName];
        return Promise.resolve([]);
      });
    return currentRequests[dataName];
  };
}
