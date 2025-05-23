import { faker } from "@faker-js/faker";
import { JobMinimal } from "@jobs/types";
import { SampleNested } from "@samples/types";
import {
    NucleotideComposition,
    Subtraction,
    SubtractionFile,
    SubtractionMinimal,
    SubtractionOption,
    SubtractionUpload,
} from "@subtraction/types";
import { UserNested } from "@users/types";
import { merge, pick } from "lodash";
import { assign } from "lodash-es";
import nock from "nock";
import { createFakeUserNested } from "./user";

/**
 * Create a fake subtraction file
 */
export function createFakeSubtractionFile(): SubtractionFile {
    return {
        download_url: faker.internet.url(),
        id: faker.number.int(),
        name: `${faker.word.noun()}s.fa`,
        size: faker.number.int({ min: 20000 }),
        subtraction: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        type: "fasta",
    };
}

type CreateFakeSubtractionNestedProps = {
    id?: string;
    name?: string;
};

/**
 * Create a fake subtraction nested
 */
export function createFakeSubtractionNested(
    props?: CreateFakeSubtractionNestedProps,
) {
    const defaultSubtractionNested = {
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        name: faker.word.noun(),
    };

    return merge(defaultSubtractionNested, props);
}

type CreateFakeSubtractionMinimal = CreateFakeSubtractionNestedProps & {
    count?: number;
    created_at?: string;
    file?: SubtractionUpload;
    job?: JobMinimal;
    nickname?: string;
    ready?: boolean;
    user?: UserNested;
};

/**
 * Create a fake minimal subtraction
 */
export function createFakeSubtractionMinimal(
    overrides?: CreateFakeSubtractionMinimal,
): SubtractionMinimal {
    const defaultSubtractionMinimal = {
        ...createFakeSubtractionNested(),
        count: faker.number.int({ max: 15 }),
        created_at: faker.date.past().toISOString(),
        file: {
            id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
            name: `${faker.word.noun()}s.fa`,
        },
        job: null,
        nickname: faker.word.noun(),
        ready: true,
        user: createFakeUserNested(),
    };

    return assign(defaultSubtractionMinimal, overrides);
}

type CreateFakeSubtraction = CreateFakeSubtractionMinimal & {
    files?: Array<SubtractionFile>;
    gc?: NucleotideComposition;
    linked_samples?: Array<SampleNested>;
};

/**
 * Create a fake subtraction
 */
export function createFakeSubtraction(
    overrides?: CreateFakeSubtraction,
): Subtraction {
    const { files, gc, linked_samples, ...props } = overrides || {};
    return {
        ...createFakeSubtractionMinimal(props),
        files: files || [createFakeSubtractionFile()],
        gc: gc || { a: 1, c: 1, g: 1, n: 1, t: 1 },
        linked_samples: linked_samples || [],
    };
}

/**
 * Create a fake subtraction shortlist
 */
export function createFakeShortlistSubtraction(): SubtractionOption {
    return pick(createFakeSubtractionMinimal(), ["id", "name", "ready"]);
}

/**
 * Sets up a mocked API route for fetching a list of subtractions
 *
 * @param Subtractions - The list of subtractions to be returned from the mocked API call
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSubtractions(Subtractions: SubtractionMinimal[]) {
    return nock("http://localhost")
        .get("/api/subtractions")
        .query(true)
        .reply(200, {
            documents: Subtractions,
            found_count: Subtractions.length,
            page: 1,
            page_count: 1,
            per_page: 25,
            ready_count: Subtractions.length,
            total_count: Subtractions.length,
        });
}

/**
 * Sets up a mocked API route for fetching a single subtraction
 *
 * @param subtractionDetail - The subtraction detail to be returned from the mocked API call
 * @param statusCode - The HTTP status code to simulate in the response
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSubtractionDetail(
    subtractionDetail: Subtraction,
    statusCode?: number,
) {
    return nock("http://localhost")
        .get(`/api/subtractions/${subtractionDetail.id}`)
        .query(true)
        .reply(statusCode || 200, subtractionDetail);
}

/**
 * Sets up a mocked API route for updating the subtraction details
 *
 * @param subtraction - The subtraction details
 * @param name - The updated name
 * @param nickname - The updated nickname
 * @returns A nock scope for the mocked API call
 */
export function mockApiEditSubtraction(
    subtraction: Subtraction,
    name: string,
    nickname: string,
) {
    const subtractionDetail = { ...subtraction, name, nickname };

    return nock("http://localhost")
        .patch(`/api/subtractions/${subtraction.id}`)
        .reply(200, subtractionDetail);
}

/**
 * Sets up a mocked API route for creating a new subtraction
 *
 * @param name - The updated name
 * @param nickname - The updated nickname
 * @param uploadId - the unique identifier of the file to be used for the subtraction
 * @returns A nock scope for the mocked API call
 */
export function mockApiCreateSubtraction(
    name: string,
    nickname: string,
    uploadId: string,
) {
    return nock("http://localhost")
        .post("/api/subtractions", { name, nickname, upload_id: uploadId })
        .reply(200, { name, nickname, id: "subtraction_id" });
}

/**
 * Sets up a mocked API route for deleting a subtraction
 *
 * @param subtractionId - The subtraction to be removed
 * @returns A nock scope for the mocked API call
 */
export function mockApiRemoveSubtraction(subtractionId: string) {
    return nock("http://localhost")
        .delete(`/api/subtractions/${subtractionId}`)
        .reply(200);
}

/**
 * Sets up a mocked API route for fetching a subtraction shortlist
 *
 * @param subtractionsShortlist - The list of subtractions to be returned from the mocked API call
 * @param ready - Indicates whether to show all the ready subtractions
 * @returns A nock scope for the mocked API call
 */
export function mockApiGetShortlistSubtractions(
    subtractionsShortlist: SubtractionOption[],
    ready?: boolean,
) {
    return nock("http://localhost")
        .get("/api/subtractions")
        .query(ready ? { short: true, ready } : true)
        .reply(200, subtractionsShortlist);
}
