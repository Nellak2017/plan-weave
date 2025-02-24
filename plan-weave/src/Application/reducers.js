import multiDelete from './boundedContexts/multiDelete/multiDeleteSlice.js'
import pagination from './boundedContexts/pagination/paginationSlice.js'
import search from './boundedContexts/search/searchSlice.js'
import sort from './boundedContexts/sort/sortSlice.js'
import timeRange from './boundedContexts/timeRange/timeRangeSlice.js'
import toggle from './boundedContexts/toggle/toggleSlice.js'
import tasks from './entities/tasks/tasks.js'
import variant from './sessionContexts/variant.js'
import dnd from './sessionContexts/dnd.js'
import auth from './sessionContexts/auth.js'
export const reducers = { tasks, variant, dnd, search, sort, multiDelete, pagination, timeRange, toggle, auth,}
export { tasks, variant, dnd, search, sort, multiDelete, pagination, timeRange, toggle, auth,}