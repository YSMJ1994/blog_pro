import '@/styles/fix.scss';
import '@/styles/global.scss';
import 'highlight.js/styles/atom-one-dark.css';
import loadIcon from '@/utils/loadIcon';
import 'moment/locale/zh-cn';
import Moment from 'moment';

Moment.locale('zh-cn');
loadIcon.load();
