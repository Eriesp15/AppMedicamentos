/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundAlarmHandler } from './src/services/alarmService';

registerBackgroundAlarmHandler();
AppRegistry.registerComponent(appName, () => App);
