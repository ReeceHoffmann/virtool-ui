import { push } from "connected-react-router";
import { put, takeEvery, takeLatest, throttle } from "redux-saga/effects";
import {
    ADD_REFERENCE_GROUP,
    ADD_REFERENCE_USER,
    CHECK_REMOTE_UPDATES,
    CLONE_REFERENCE,
    EDIT_REFERENCE,
    EDIT_REFERENCE_GROUP,
    EDIT_REFERENCE_USER,
    EMPTY_REFERENCE,
    FIND_REFERENCES,
    GET_REFERENCE,
    IMPORT_REFERENCE,
    REMOTE_REFERENCE,
    REMOVE_REFERENCE,
    REMOVE_REFERENCE_GROUP,
    REMOVE_REFERENCE_USER,
    UPDATE_REMOTE_REFERENCE
} from "../app/actionTypes";
import { apiCall, pushFindTerm } from "../utils/sagas";
import * as referenceAPI from "./api";

export function* afterReferenceCreation() {
    yield put(
        push({
            pathname: "/refs",
            state: {
                cloneReference: false,
                emptyReference: false,
                importReference: false
            }
        })
    );
}

export function* findReferences(action) {
    yield apiCall(referenceAPI.find, action.payload, FIND_REFERENCES);
    yield pushFindTerm(action.payload.term);
}

export function* getReference(action) {
    yield apiCall(referenceAPI.get, action.payload, GET_REFERENCE);
}

export function* emptyReference(action) {
    const resp = yield apiCall(referenceAPI.create, action.payload, EMPTY_REFERENCE);

    if (resp.ok) {
        yield afterReferenceCreation();
    }
}

export function* editReference(action) {
    yield apiCall(referenceAPI.edit, action.payload, EDIT_REFERENCE);
}

export function* removeReference(action) {
    const resp = yield apiCall(referenceAPI.remove, action.payload, REMOVE_REFERENCE);

    if (resp.ok) {
        yield put(push("/refs"));
    }
}

export function* importReference(action) {
    const resp = yield apiCall(referenceAPI.importReference, action.payload, IMPORT_REFERENCE);

    if (resp.ok) {
        yield afterReferenceCreation();
    }
}

export function* cloneReference(action) {
    const resp = yield apiCall(referenceAPI.cloneReference, action.payload, CLONE_REFERENCE);

    if (resp.ok) {
        yield afterReferenceCreation();
    }
}

export function* remoteReference() {
    const resp = yield apiCall(
        referenceAPI.remoteReference,
        { remote_from: "virtool/ref-plant-viruses" },
        REMOTE_REFERENCE
    );

    if (resp.ok) {
        yield afterReferenceCreation();
    }
}

export function* addRefUser(action) {
    yield apiCall(referenceAPI.addUser, action.payload, ADD_REFERENCE_USER);
}

export function* editRefUser(action) {
    yield apiCall(referenceAPI.editUser, action.payload, EDIT_REFERENCE_USER);
}

export function* removeRefUser(action) {
    yield apiCall(referenceAPI.removeUser, action.payload, REMOVE_REFERENCE_USER, {
        userId: action.payload.userId,
        refId: action.payload.refId
    });
}

export function* addRefGroup(action) {
    yield apiCall(referenceAPI.addGroup, action, ADD_REFERENCE_GROUP);
}

export function* editRefGroup(action) {
    yield apiCall(referenceAPI.editGroup, action, EDIT_REFERENCE_GROUP);
}

export function* removeRefGroup(action) {
    yield apiCall(referenceAPI.removeGroup, action, REMOVE_REFERENCE_GROUP, {
        groupId: action.payload.groupId,
        refId: action.payload.refId
    });
}

export function* checkRemoteUpdates(action) {
    yield apiCall(referenceAPI.checkUpdates, action.payload, CHECK_REMOTE_UPDATES);
}

export function* updateRemoteReference(action) {
    yield apiCall(referenceAPI.updateRemote, action.payload, UPDATE_REMOTE_REFERENCE);
}

export function* watchReferences() {
    yield throttle(500, EMPTY_REFERENCE.REQUESTED, emptyReference);
    yield throttle(500, IMPORT_REFERENCE.REQUESTED, importReference);
    yield throttle(500, CLONE_REFERENCE.REQUESTED, cloneReference);
    yield throttle(500, REMOTE_REFERENCE.REQUESTED, remoteReference);
    yield takeEvery(EDIT_REFERENCE.REQUESTED, editReference);
    yield takeLatest(GET_REFERENCE.REQUESTED, getReference);
    yield takeLatest(FIND_REFERENCES.REQUESTED, findReferences);
    yield throttle(500, REMOVE_REFERENCE.REQUESTED, removeReference);
    yield takeEvery(ADD_REFERENCE_USER.REQUESTED, addRefUser);
    yield takeEvery(EDIT_REFERENCE_USER.REQUESTED, editRefUser);
    yield takeEvery(REMOVE_REFERENCE_USER.REQUESTED, removeRefUser);
    yield takeEvery(ADD_REFERENCE_GROUP.REQUESTED, addRefGroup);
    yield takeEvery(EDIT_REFERENCE_GROUP.REQUESTED, editRefGroup);
    yield takeEvery(REMOVE_REFERENCE_GROUP.REQUESTED, removeRefGroup);
    yield takeEvery(CHECK_REMOTE_UPDATES.REQUESTED, checkRemoteUpdates);
    yield takeEvery(UPDATE_REMOTE_REFERENCE.REQUESTED, updateRemoteReference);
}
