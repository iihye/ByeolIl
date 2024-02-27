import { MAX_SATR_CNT } from "./data.js";

const treeHeight = Math.ceil(Math.log(MAX_SATR_CNT) / Math.log(2));
const treeSize = 1 << (treeHeight + 1);

let tree = Array(treeSize).fill(0);

function treeReset() {
    tree.fill(0);
}

function update(node, start, end, index, value) {
    if (index < start || end < index) {
        return;
    }

    if (start === end) {
        tree[node] = value;
        return;
    }

    let mid = Math.floor((start + end) / 2);
    update(node * 2, start, mid, index, value);
    update(node * 2 + 1, mid + 1, end, index, value);
    tree[node] = tree[node * 2] + tree[node * 2 + 1];
}

function query(node, start, end, left, right) {
    if (end < left || right < start) {
        return 0;
    }

    if (left <= start && end <= right) {
        return tree[node];
    }

    let mid = Math.floor((start + end) / 2);
    let l = query(node * 2, start, mid, left, right);
    let r = query(node * 2 + 1, mid + 1, end, left, right);

    return l + r;
}

export const constellationCheck = {
    update,
    query,
    treeReset,
    tree,
};
