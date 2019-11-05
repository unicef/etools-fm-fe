import {StaticDataActions, StaticDataActionTypes} from '../actions/static-data.actions';
import {Reducer} from 'redux';

const INITIAL: IStaticDataState = {};

export const staticData: Reducer<IStaticDataState, any> = (
  state: IStaticDataState = INITIAL,
  action: StaticDataActions<any>
) => {
  const {dataName, payload: data = []} = action;
  switch (action.type) {
    case StaticDataActionTypes.ADD_STATIC_DATA:
      if (state[dataName]) {
        throw new Error(`Data "${dataName}" was already added. Use Reset or Update actions.`);
      }
      return {
        [dataName]: data,
        ...state
      };

    case StaticDataActionTypes.UPDATE_STATIC_DATA:
      if (!state[dataName]) {
        throw new Error(`Data "${dataName}" is missing. Use Add data action first.`);
      }
      const newStateData: IStaticDataState = {...state};
      const currentData: any = newStateData[dataName];
      newStateData[dataName] = [...(currentData || []), data];
      return newStateData;

    case StaticDataActionTypes.RESET_STATIC_DATA:
      return {
        ...state,
        [dataName]: data
      };

    default:
      return state;
  }
};
