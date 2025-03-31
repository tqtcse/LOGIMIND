import { mock } from './MockAdapter'
import './api/authApi'
import './api/customersApi'
import './api/fileApi'
import './api/accountsApi'
import './api/aiApi'
import './api/dashboardApi'
import './api/imgApi'

mock.onAny().passThrough()
