import {FEATURES_FLAGS} from '../../endpoints/endpoints-list';
import {getEndpoint} from '../../endpoints/endpoints';
import {EtoolsLogger} from '@unicef-polymer/etools-utils/dist/singleton/logger';
import '../common/error-warn-box';
import {request} from '../../endpoints/request';
import {EtoolsErrorWarnBox} from '../common/error-warn-box';

export function checkEnvFlags(): Promise<any> {
  return request(getEndpoint(FEATURES_FLAGS).url)
    .then((response: any) => {
      handleEnvFlagsReceived(response);
      return response;
    })
    .catch((err: any) => {
      EtoolsLogger.error('checkEnvFlags error', 'environment-flags', err);
      if (err.status === 403) {
        window.location.href = window.location.origin + '/login/';
      }
      throw err;
    });
}

function handleEnvFlagsReceived(envFlags: any): void {
  if (envFlags && envFlags.active_flags && envFlags.active_flags.includes('fm_disabled')) {
    const bodyEl: HTMLElement | null = document.querySelector('body');
    if (bodyEl) {
      bodyEl.querySelectorAll('*').forEach((el: Element) => el.remove());
      const warnBox: EtoolsErrorWarnBox = document.createElement('etools-error-warn-box') as EtoolsErrorWarnBox;
      warnBox.messages = [
        'Field Monitoring is currently unavailable in your workspace, please stay tuned... ' +
          'In the meantime checkout our other great modules'
      ];
      bodyEl.appendChild(warnBox);
    }
  }
}
