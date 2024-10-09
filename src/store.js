import { proxy } from "valtio";

const state = proxy({
    intro: true,
    selectedColor: '#EFBD4E'
})

export {
    state
}
