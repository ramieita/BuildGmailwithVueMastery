import {reactive} from 'vue';

let emails = reactive(new Set())
// we make global from every template
export const useEmailSelection = function () {
  // let emails = reactive(new Set())
  let toggle = function (email) {
    if (emails.has(email)) {
      emails.delete(email)
    } else {
      emails.add(email)
    }
  }

  return {
    emails,
    toggle
  }
}

export default useEmailSelection
