
const randomString = () =>
  Math.random().toString(36).substring(8).split('').join('_')

const ActionTypes = {
  INIT: `@@kayak/INIT${randomString()}`,
  REPLACE: `@@kayak/REPLACE${randomString()}`,
}

export default ActionTypes

export function isObject(action: any) {
  return typeof action == 'object' && action != null;
}